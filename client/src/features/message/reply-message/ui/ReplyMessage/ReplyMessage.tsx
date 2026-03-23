import './style.scss'
import { useReplyMessage } from 'src/features/message'

import { AppIcon, AppText } from 'src/shared/ui'

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
