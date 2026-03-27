import './style.scss'

import type { IDateSeparatorProps } from 'src/features/message/message-list/ui/DateSeparator/config'

import { AppText } from 'src/shared/ui'

export const DateSeparator = ({ label }: IDateSeparatorProps) => {
  return (
    <div className="message-date-separator">
      <AppText size="small">{label}</AppText>
    </div>
  )
}
