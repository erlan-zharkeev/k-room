import './style.scss'

import { AppText } from 'src/shared/ui'

import type { IDateSeparatorProps } from '../..'

export const DateSeparator = ({ label }: IDateSeparatorProps) => {
  return (
    <div className="message-date-separator">
      <AppText size="small">{label}</AppText>
    </div>
  )
}
