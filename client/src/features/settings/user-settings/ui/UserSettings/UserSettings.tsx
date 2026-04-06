import './style.scss'

import { PrivacyPolicyLink } from 'src/features/privacy-policy'
import {
  ThemeSwitcher,
  ShowWallpaperSwitcher,
  ShowTooltipsSwitcher,
  ShowNotificationSwitcher,
  LanguageSwitcher,
  EnableSoundSwitcher
} from 'src/features/settings'
import { TechSupportLink } from 'src/features/support'
import { UserProfileData } from 'src/features/user'

import { CLIENT_ENV } from 'src/shared/config'
import { AppText } from 'src/shared/ui'

export const UserSettings = () => {
  const { appName, appVersion } = CLIENT_ENV

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
          <TechSupportLink />
          <PrivacyPolicyLink />
          <div className="user-settings__info-package-data">
            <AppText size="small">{appName}</AppText>
            <AppText size="small">v.{appVersion}</AppText>
          </div>
        </div>
      </div>
    </div>
  )
}
