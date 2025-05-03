import './style.scss'

import { PrivacyPolicyLink } from 'src/features/privacy-policy'
import {
  EnableSoundSwitcher,
  ShowNotificationSwitcher,
  ShowTooltipsSwitcher,
  ShowWallpaperSwitcher,
  ThemeSwitcher
} from 'src/features/settings'
import { TechSupportLink } from 'src/features/support'
import { UserProfileData } from 'src/features/user/user-profile-data'

import { useSystem } from 'src/entities/system'

export const UserSettings = () => {
  const {
    appData: { name, version }
  } = useSystem()
  const Switchers = [
    <ThemeSwitcher />,
    <EnableSoundSwitcher />,
    <ShowTooltipsSwitcher />,
    <ShowWallpaperSwitcher />,
    <ShowNotificationSwitcher />
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
          <div className="user-settings__app-name paragraph-text paragraph-text-sm">{name}</div>
          <div className="user-settings__version paragraph-text paragraph-text-sm">v.{version}</div>
        </div>
      </div>
    </div>
  )
}
