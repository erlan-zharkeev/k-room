import UIIcon from 'src/components/UI/UIIcon/UIIcon'
import Reactions from '../Reactions/Reactions'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { setRepliedMessage } from 'src/store/roomsSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { showModal } from 'src/store/systemSlice'
import { SocketActions } from 'common-types'
import { socket } from 'src/socket/socket'
import useSelectedRoom from 'src/hooks/useSelectedRoom'

const MessageContextMenu = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { message } = useTypedSelector((state) => state.system.contextMenu.contextClickedObject)
  const { id, username } = useTypedSelector((state) => state.user.userData)

  const selectedChatRoom = useSelectedRoom()

  const selfReactions =
    message.reactions?.filter((reaction) => reaction.authorId === id).map((reaction) => reaction.glyphKey) ?? []

  const reactionHandler = (key: string) => {
    socket.emit(SocketActions.ADD_REACTION, {
      glyphKey: key,
      messageId: message.id,
      roomId: selectedChatRoom?.roomId,
      authorId: id,
      username
    })
  }

  const forwardHandler = () => {
    dispatch(showModal({ title: 'Forward message', modalContentComponentName: 'ForwardMessagePopup' }))
  }

  const deleteHandler = () => {
    console.log('delete')
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
      <div className="message-context-menu__element context-menu__element delete-icon" onClick={deleteHandler}>
        <UIIcon name="trash" />
        <span>Delete</span>
      </div>
    </div>
  )
}

export default MessageContextMenu
