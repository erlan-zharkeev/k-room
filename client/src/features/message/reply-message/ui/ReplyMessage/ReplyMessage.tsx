import './style.scss'
import { AppIcon, AppText } from 'src/shared/ui'

import { useReplyMessage } from '../../..'

export const ReplyMessage = () => {
  const { id, authorName, body, closeReplyMessage } = useReplyMessage()
  if (!id) return null

  return (
    <div className="reply-message">
      <AppIcon name="reply" color="accent-color" />
      <div className="reply-message__content">
        <AppText>{authorName}</AppText>
        <AppText>{body}</AppText>
      </div>
      <div className="reply-message__close" onClick={closeReplyMessage}>
        <AppIcon name="cross" />
      </div>
    </div>
  )
}
