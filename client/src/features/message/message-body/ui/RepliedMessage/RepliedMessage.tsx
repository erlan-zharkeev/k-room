import './style.scss'

import { useI18n } from 'src/entities/system'

import { AppText } from 'src/shared/ui'

import { MessageImages, REPLIED_MESSAGE_I18N } from '../..'
import type { IRepliedMessageProps } from '../..'

export const RepliedMessage = ({ message }: IRepliedMessageProps) => {
  if (!message.repliedMessage?.id) return null

  const { authorName, body } = message.repliedMessage
  const { t } = useI18n()

  return (
    <div className="replied-message">
      <AppText color="accent-color">
        {message.repliedMessage?.forward ? t(REPLIED_MESSAGE_I18N.forwarded) : t(REPLIED_MESSAGE_I18N.replied)}
      </AppText>
      <div className="replied-message__body">
        <MessageImages message={message.repliedMessage} />
        <AppText tag="p">{authorName}</AppText>
        <AppText tag="p">{body}</AppText>
      </div>
    </div>
  )
}
