import { AppText } from 'src/shared/ui'

import styles from './DateSeparator.module.scss'
import { IDateSeparatorProps } from './types'

export const DateSeparator = ({ label }: IDateSeparatorProps) => {
  return (
    <div className={styles.root}>
      <AppText size="small">{label}</AppText>
    </div>
  )
}
