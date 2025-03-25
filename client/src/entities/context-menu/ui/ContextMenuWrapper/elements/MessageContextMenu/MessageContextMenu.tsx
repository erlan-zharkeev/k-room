import './style.scss'
import { SocketActions, EventAddReaction, EventDeleteMessage } from 'common-types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import { socket } from 'src/shared/api'
import { Reactions } from './elements'
import { AppIcon } from 'src/shared/ui'
import {
  repliedMessageSetAsForward,
  updateMessageStatus,
  setRepliedMessage,
  useChatRooms
} from 'src/entities/chat-room'
import { showModal } from 'src/entities/system'
import { useTypedSelector } from 'src/shared/lib'

export const MessageContextMenu = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { message } = useTypedSelector((state) => state.system.contextMenu.contextClickedObject)
  const { id, username } = useTypedSelector((state) => state.user.userData)

  const { selectedChatRoom } = useChatRooms()

  const selfReactions =
    message.reactions?.filter((reaction) => reaction.authorId === id).map((reaction) => reaction.glyphKey) ?? []

  const reactionHandler = (key: string) => {
    const payload: EventAddReaction = {
      glyphKey: key,
      messageId: message.id,
      roomId: selectedChatRoom?.id ?? '',
      username
    }
    socket.emit<SocketActions>('add-reaction', payload)
  }

  const forwardHandler = () => {
    dispatch(repliedMessageSetAsForward())
    dispatch(showModal({ title: 'Forward message', modalContentComponentName: 'forward-message-popup' }))
  }

  const deleteHandler = () => {
    if (!selectedChatRoom?.id) return
    const roomId = selectedChatRoom.id
    const messageId = message.id
    const payload: EventDeleteMessage = {
      roomId,
      messageId
    }

    dispatch(updateMessageStatus({ roomId, messageId, status: 'sending' }))
    socket.emit<SocketActions>('delete-message', payload)
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
        <AppIcon name="reply" />
        <span>Reply</span>
      </div>
      <div className="message-context-menu__element context-menu__element forward-icon" onClick={forwardHandler}>
        <AppIcon name="reply" />
        <span>Forward</span>
      </div>
      {message.isSelf && (
        <div className="message-context-menu__element context-menu__element delete-icon" onClick={deleteHandler}>
          <AppIcon name="trash" />
          <span>Delete</span>
        </div>
      )}
    </div>
  )
}
