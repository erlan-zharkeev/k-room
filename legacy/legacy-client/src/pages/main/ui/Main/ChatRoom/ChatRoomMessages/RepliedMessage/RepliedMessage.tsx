import { useI18n } from 'src/shared/preferences'
import { AppText } from 'src/shared/ui'

import { MessageImages } from '../MessageImages/MessageImages'
import styles from './RepliedMessage.module.scss'
import { REPLIED_MESSAGE_I18N } from './i18n'
import { IRepliedMessageProps } from './types'

export const RepliedMessage = ({ message }: IRepliedMessageProps) => {
  if (!message.repliedMessage?.id) return null

  const { authorName, body } = message.repliedMessage
  const { t } = useI18n()

  return (
    <div className={styles.root}>
      <AppText color="accent-color">
        {message.repliedMessage.forward ? t(REPLIED_MESSAGE_I18N.forwarded) : t(REPLIED_MESSAGE_I18N.replied)}
      </AppText>
      <div>
        <MessageImages message={message.repliedMessage} />
        <AppText tag="p">{authorName}</AppText>
        <AppText tag="p">{body}</AppText>
      </div>
    </div>
  )
}
