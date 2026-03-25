import './style.scss'

import { IMessage } from 'common'

import { useI18n } from 'src/entities/system'

import { AppText } from 'src/shared/ui'

import { MessageImages } from '../MessageImages/MessageImages'

import { REPLIED_MESSAGE_I18N } from './config'

export const RepliedMessage = ({ message }: { message: IMessage }) => {
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
