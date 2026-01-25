import './style.scss'

import { AppText } from 'src/shared/ui'

export const NoMessagesPlaceholder = ({ messages }: { messages: string[] }) => {
  if (messages.length) return null

  return (
    <div className="no-messages-placeholder">
      <AppText>There are no messages, write first</AppText>
    </div>
  )
}
