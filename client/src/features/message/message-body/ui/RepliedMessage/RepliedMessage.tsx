import './style.scss'

import { IMessage } from 'common-types'

import { AppText } from 'src/shared/ui'

import { MessageImages } from '../MessageImages/MessageImages'

export const RepliedMessage = ({ message }: { message: IMessage }) => {
  if (!message.repliedMessage?.id) return null

  const { authorName, body } = message.repliedMessage

  return (
    <div className="replied-message">
      <AppText color="accent-color">{message.repliedMessage?.forward ? 'Forwarded' : 'Replied'}</AppText>
      <div className="replied-message__body">
        <MessageImages message={message.repliedMessage} />
        <AppText tag="p">{authorName}</AppText>
        <AppText tag="p">{body}</AppText>
      </div>
    </div>
  )
}
