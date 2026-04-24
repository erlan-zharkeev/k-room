import { useI18n } from 'src/shared/preferences'
import { AppText } from 'src/shared/ui'

import styles from './NoMessagesPlaceholder.module.scss'
import { NO_MESSAGES_PLACEHOLDER_I18N } from './i18n'

export const NoMessagesPlaceholder = () => {
  const { t } = useI18n()

  return (
    <div className={styles.root}>
      <AppText tag="div" align="center">
        {t(NO_MESSAGES_PLACEHOLDER_I18N.text)}
      </AppText>
    </div>
  )
}
