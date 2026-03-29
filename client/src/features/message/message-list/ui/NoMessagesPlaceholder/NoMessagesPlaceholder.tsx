import './style.scss'

import { useI18n } from 'src/entities/system'

import { AppText } from 'src/shared/ui'

import { NO_MESSAGES_PLACEHOLDER_I18N } from './config'

export const NoMessagesPlaceholder = () => {
  const { t } = useI18n()

  return (
    <div className="no-messages-placeholder">
      <AppText tag="div" align="center">
        {t(NO_MESSAGES_PLACEHOLDER_I18N.text)}
      </AppText>
    </div>
  )
}
