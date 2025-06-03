import './style.scss'
import { AppIcon, AppText } from 'src/shared/ui'

import { useReplyMessage } from '../../hooks'

export const ReplyMessage = () => {
  const { id, authorName, body, closeReplyMessage } = useReplyMessage()
  if (!id) return null

  return (
    <div className="reply-message">
      <div className="reply-message__icon">
        <AppIcon name="reply" color="accent-color" />
      </div>
      <div className="reply-message__content">
        <AppText>{authorName}</AppText>
        <AppText>{body}</AppText>
        {/* <div className="reply-message__author">{authorName}</div>
        <div className="reply-message__text">{body}</div> */}
      </div>
      <div className="reply-message__close" onClick={closeReplyMessage}>
        <AppIcon name="cross" />
      </div>
    </div>
  )
}
