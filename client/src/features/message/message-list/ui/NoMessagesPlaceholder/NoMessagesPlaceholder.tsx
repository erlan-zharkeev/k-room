import './style.scss'

import { NO_MESSAGES_PLACEHOLDER_I18N } from 'src/features/message/message-list/ui/NoMessagesPlaceholder/config'

import { useI18n } from 'src/entities/system'

import { AppText } from 'src/shared/ui'

export const NoMessagesPlaceholder = () => {
  const { t } = useI18n()

  return (
    <div className="no-messages-placeholder">
      <AppText align="center">{t(NO_MESSAGES_PLACEHOLDER_I18N.text)}</AppText>
    </div>
  )
}
