import { AppText } from 'src/shared/ui'

import styles from './DateSeparator.module.scss'
import { DateSeparatorProps } from './types'

export const DateSeparator = ({ label }: DateSeparatorProps) => {
  return (
    <div className={styles.root}>
      <AppText size="small">{label}</AppText>
    </div>
  )
}
