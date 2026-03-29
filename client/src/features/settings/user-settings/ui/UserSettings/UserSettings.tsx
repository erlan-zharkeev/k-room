import './style.scss'

import { PrivacyPolicyLink } from 'src/features/privacy-policy'
import { TechSupportLink } from 'src/features/support'
import { UserProfileData } from 'src/features/user'

import { useSystem } from 'src/entities/system'

import { AppText } from 'src/shared/ui'

import { EnableSoundSwitcher } from '../../../toggle-enable-sound'
import { LanguageSwitcher } from '../../../toggle-language'
import { ShowNotificationSwitcher } from '../../../toggle-show-notification'
import { ShowTooltipsSwitcher } from '../../../toggle-show-tooltips'
import { ShowWallpaperSwitcher } from '../../../toggle-show-wallpaper'
import { ThemeSwitcher } from '../../../update-theme'

export const UserSettings = () => {
  const {
    appData: { name, version }
  } = useSystem()

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
            <AppText size="small">{name}</AppText>
            <AppText size="small">v.{version}</AppText>
          </div>
        </div>
      </div>
    </div>
  )
}
