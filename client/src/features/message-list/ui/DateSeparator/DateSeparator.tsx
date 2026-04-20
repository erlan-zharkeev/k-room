import './style.scss'

import { IDateSeparatorProps } from 'src/features/message-list'

import { AppText } from 'src/shared/ui'

export const DateSeparator = ({ label }: IDateSeparatorProps) => {
  return (
    <div className="message-date-separator">
      <AppText size="small">{label}</AppText>
    </div>
  )
}
