import UIIcon from 'src/components/UI/UIIcon'
import Reactions from '../Reactions/Reactions'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { setRepliedMessage } from 'src/store/roomsSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { showModal } from 'src/store/systemSlice'

export const MessageContextMenu = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { message } = useTypedSelector((state) => state.system.contextMenu.contextClickedObject)

  const reactionHandler = (reaction: string) => {
    console.log(reaction, 'reaction')
  }

  const forwardHandler = () => {
    dispatch(showModal({ title: 'Forward message', modalContentComponentName: 'ForwardMessagePopup' }))
  }

  return (
    <div className="message-context-menu">
      <div className="message-context-menu__element">
        <Reactions reactionHandler={reactionHandler} />
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
    </div>
  )
}

export default MessageContextMenu
