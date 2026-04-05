import './style.scss'
import { useReplyMessage } from 'src/features/message'

import { useI18n } from 'src/entities/settings'

import { AppButton, AppIcon, AppText } from 'src/shared/ui'

import { REPLY_MESSAGE_I18N } from './config'

export const ReplyMessage = () => {
  const { t } = useI18n()
  const { id, authorName, body, closeReplyMessage } = useReplyMessage()

  if (!id) return null

  return (
    <div className="reply-message">
      <AppIcon name="reply" color="accent-color" />
      <div className="reply-message__content">
        <AppText>{authorName}</AppText>
        <AppText>{body}</AppText>
      </div>
      <AppButton
        prefixIconName="cross"
        borderless
        additionalClassName="reply-message__close"
        onClick={closeReplyMessage}
        ariaLabel={t(REPLY_MESSAGE_I18N.closePreview)}
      />
    </div>
  )
}
