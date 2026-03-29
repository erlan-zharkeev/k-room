import { useI18n } from 'src/entities/system'

import { INFO_NOTIFICATIONS_I18N } from '../..'

export const WelcomeInfoNotification = () => {
  const { t } = useI18n()

  return (
    <>
      <div className="app-text">{t(INFO_NOTIFICATIONS_I18N.welcomeParagraph1)}</div>
      <div className="app-text">{t(INFO_NOTIFICATIONS_I18N.welcomeParagraph2)}</div>
      <div className="app-text">{t(INFO_NOTIFICATIONS_I18N.welcomeParagraph3)}</div>
      <div className="app-text">{t(INFO_NOTIFICATIONS_I18N.welcomeParagraph4)}</div>
    </>
  )
}
