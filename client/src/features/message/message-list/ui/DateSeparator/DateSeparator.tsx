import './style.scss'

import { AppText } from 'src/shared/ui'

export const DateSeparator = ({ label }: { label: string }) => {
  return (
    <div className="message-date-separator">
      <AppText size="small">{label}</AppText>
    </div>
  )
}
