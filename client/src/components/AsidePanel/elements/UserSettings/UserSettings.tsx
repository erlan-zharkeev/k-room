import Meta from 'antd/lib/card/Meta'
import appData from '../../../../../package.json'
import { UserSettingKey, RouteNames, Theme } from 'common-types'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { UIAvatar, UISwitch } from 'src/components'
import { useTypedSelector, useUpdateSettings } from 'src/hooks'
import { AppDispatch, showModal } from 'src/store'
import { ModalContentComponentName } from 'src/@types'

export enum UserSettingName {
  theme = 'theme',
  tooltips = 'tooltips',
  notification = 'notification',
  sound = 'sound'
}

const { VITE_MAIL_APP } = import.meta.env

export const UserSettings = () => {
  const { username, email, id, avatarPath } = useTypedSelector((state) => state.user.userData)
  const { theme, soundOn, showTooltips, ableToShowNotification } = useTypedSelector((state) => state.persist.settings)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { updateSetting } = useUpdateSettings()

  const changeUserData = () => {
    dispatch(
      showModal({
        title: 'Update User Data',
        modalContentComponentName: ModalContentComponentName.userDataSettingsPopup
      })
    )
  }

  const changeSetting = (value: boolean, id: string) => {
    let type: UserSettingKey | null = null
    switch (id) {
      case UserSettingName.theme:
        type = UserSettingKey.theme
        break
      case UserSettingName.sound:
        type = UserSettingKey.soundOn
        break
      case UserSettingName.tooltips:
        type = UserSettingKey.showTooltips
        break
      case UserSettingName.notification:
        type = UserSettingKey.ableToShowNotification
        break
      default:
        break
    }
    if (!type) return
    updateSetting(type, {
      commonSettings: value
    })
  }

  return (
    <div className="user-settings">
      <div className="user-settings__body">
        <div className="user-settings__user-card" onClick={changeUserData}>
          <Meta
            avatar={<UIAvatar size="medium" showBadge={false} src={avatarPath} />}
            title={username}
            description={email}
          />
          <span className="user-settings__id paragraph-text paragraph-text-sm paragraph-text--secondary">#{id}</span>
        </div>
        <div
          className="link paragraph-text user-settings__password-recovery"
          onClick={() => navigate(RouteNames.PASSWORD_RECOVERY)}
        >
          Password recovery
        </div>
        <div className="user-settings__theme-switch">
          <div className="user-settings__title paragraph-text paragraph-text--secondary">Theme</div>
          <UISwitch
            onText="Dark"
            id="theme"
            offText="Light"
            initValue={theme === Theme.dark}
            onChange={changeSetting}
          />
        </div>
        <div className="user-settings__sound-switch">
          <div className="user-settings__title paragraph-text paragraph-text--secondary">Sound</div>
          <UISwitch initValue={soundOn} id="sound" onChange={changeSetting} />
        </div>
        <div className="user-settings__tooltip-switch">
          <div className="user-settings__title paragraph-text paragraph-text--secondary">Tooltips</div>
          <UISwitch initValue={showTooltips} id="tooltips" onText="Show" offText="Hide" onChange={changeSetting} />
        </div>
        <div className="user-settings__tooltip-switch">
          <div className="user-settings__title paragraph-text paragraph-text--secondary">Notification</div>
          <UISwitch
            initValue={ableToShowNotification}
            id="notification"
            onText="Show"
            offText="Hide"
            onChange={changeSetting}
          />
        </div>
      </div>
      <div className="user-settings__info">
        <a className="link paragraph-text" href={`mailto:${VITE_MAIL_APP}?subject=Support%20Request(${id})`}>
          Tech support
        </a>
        <a className="link paragraph-text" onClick={() => navigate(RouteNames.PRIVACY_POLICY)}>
          Privacy policy
        </a>
        <div className="user-settings__app-name paragraph-text paragraph-text-sm paragraph-text--secondary">
          {appData.name}
        </div>
        <div className="user-settings__version paragraph-text paragraph-text-sm paragraph-text--secondary">
          v.{appData.version}
        </div>
      </div>
    </div>
  )
}
