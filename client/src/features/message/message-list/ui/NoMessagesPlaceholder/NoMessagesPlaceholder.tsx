import './style.scss'

import { AppText } from 'src/shared/ui'

export const NoMessagesPlaceholder = () => {
  return (
    <div className="no-messages-placeholder">
      <AppText>There are no messages, write first</AppText>
    </div>
  )
}
