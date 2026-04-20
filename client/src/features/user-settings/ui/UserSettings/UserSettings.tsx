import './style.scss'

import { ROUTE_NAMES, defineI18n } from 'common'

import { EnableSoundSwitcher } from 'src/features/toggle-enable-sound'
import { LanguageSwitcher } from 'src/features/toggle-language'
import { ShowNotificationSwitcher } from 'src/features/toggle-show-notification'
import { ShowTooltipsSwitcher } from 'src/features/toggle-show-tooltips'
import { ShowWallpaperSwitcher } from 'src/features/toggle-show-wallpaper'
import { ThemeSwitcher } from 'src/features/update-theme'
import { UserProfileData } from 'src/features/user-profile-data'

import { CLIENT_ENV } from 'src/shared/config'
import { useI18n } from 'src/shared/preferences'
import { AppLink, AppText } from 'src/shared/ui'

const USER_SETTINGS_I18N = defineI18n({
  legalInfoLink: {
    en: 'Legal information',
    ru: 'Правовая информация'
  },
  techSupportLink: {
    en: (email: string) => `Support: ${email}`,
    ru: (email: string) => `Поддержка: ${email}`
  }
})

export const UserSettings = () => {
  const { appName, appVersion, supportEmail } = CLIENT_ENV
  const { t } = useI18n()

  const Switchers = [
    <ThemeSwitcher />,
    <EnableSoundSwitcher />,
    <ShowTooltipsSwitcher />,
    <ShowWallpaperSwitcher />,
    <ShowNotificationSwitcher />,
    <LanguageSwitcher />
  ]

  return (
    <div className="user-settings">
      <div className="user-settings__body">
        <div className="user-settings__top-side">
          <UserProfileData />
          <div className="user-settings__switchers">
            {Switchers.map((setting, idx) => {
              return (
                <div className="user-settings__element" key={idx}>
                  {setting}
                </div>
              )
            })}
          </div>
        </div>
        <div className="user-settings__info">
          <AppLink
            text={t(USER_SETTINGS_I18N.techSupportLink)(supportEmail)}
            href={`mailto:${supportEmail}`}
            target="_self"
          />
          <AppLink to={ROUTE_NAMES.privacyPolicy} text={t(USER_SETTINGS_I18N.legalInfoLink)} />
          <div className="user-settings__info-package-data">
            <AppText size="small">{appName}</AppText>
            <AppText size="small">v.{appVersion}</AppText>
          </div>
        </div>
      </div>
    </div>
  )
}
