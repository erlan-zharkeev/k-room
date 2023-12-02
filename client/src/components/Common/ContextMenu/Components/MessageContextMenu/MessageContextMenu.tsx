import { SocketActionsPayload, SocketActions, MessageStatus } from 'common-types'
import { useDispatch } from 'react-redux'
import { UIIcon } from 'src/components'
import { ModalContentComponentName } from 'src/components/common/Popup/@types'
import { useTypedSelector, useSelectedRoom } from 'src/hooks'
import { AppDispatch } from 'src/store'
import { repliedMessageSetAsForward, updateMessageStatus, setRepliedMessage } from 'src/store/rooms-slice'
import { showModal } from 'src/store/system-slice'
import { Reactions } from './components'
import { $socket } from 'src/services'

export const MessageContextMenu = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { message } = useTypedSelector((state) => state.system.contextMenu.contextClickedObject)
  const { id, username } = useTypedSelector((state) => state.user.userData)

  const selectedChatRoom = useSelectedRoom()

  const selfReactions =
    message.reactions?.filter((reaction) => reaction.authorId === id).map((reaction) => reaction.glyphKey) ?? []

  const reactionHandler = (key: string) => {
    const payload: SocketActionsPayload['addReaction'] = {
      glyphKey: key,
      messageId: message.id,
      roomId: selectedChatRoom?.id ?? '',
      username
    }
    $socket.emit(SocketActions.ADD_REACTION, payload)
  }

  const forwardHandler = () => {
    dispatch(repliedMessageSetAsForward())
    dispatch(
      showModal({ title: 'Forward message', modalContentComponentName: ModalContentComponentName.forwardMessagePopup })
    )
  }

  const deleteHandler = () => {
    if (!selectedChatRoom?.id) return
    const roomId = selectedChatRoom.id
    const messageId = message.id
    const payload: SocketActionsPayload['deleteMessage'] = {
      roomId,
      messageId
    }

    dispatch(updateMessageStatus({ roomId, messageId, status: MessageStatus.sending }))
    $socket.emit(SocketActions.DELETE_MESSAGE, payload)
  }

  return (
    <div className="message-context-menu">
      <div className="message-context-menu__element">
        <Reactions reactionHandler={reactionHandler} blockedKeys={selfReactions} />
      </div>
      <div
        className="message-context-menu__element context-menu__element"
        onClick={() => dispatch(setRepliedMessage(message))}
      >
        <UIIcon name="reply" />
        <span>Reply</span>
      </div>
      <div className="message-context-menu__element context-menu__element forward-icon" onClick={forwardHandler}>
        <UIIcon name="reply" />
        <span>Forward</span>
      </div>
      {message.isSelf && (
        <div className="message-context-menu__element context-menu__element delete-icon" onClick={deleteHandler}>
          <UIIcon name="trash" />
          <span>Delete</span>
        </div>
      )}
    </div>
  )
}
