import './style.scss'
import { IMessage } from 'common-types'

import { AppText } from 'src/shared/ui'

export const NoMessagesPlaceholder = ({ messages }: { messages: IMessage[] }) => {
  if (messages.length) return null

  return (
    <div className="no-messages-placeholder">
      <AppText>There are no messages, write first</AppText>
    </div>
  )
}
