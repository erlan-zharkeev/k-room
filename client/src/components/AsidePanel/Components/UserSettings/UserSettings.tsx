import Meta from 'antd/lib/card/Meta'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { AppDispatch } from 'src/store'
import { showModal } from 'src/store/systemSlice'
import appData from '../../../../../package.json'
import { changeTheme, setSoundValue, setTooltipsValue, setAbleToShowNotification } from 'src/store/settingsSlice'
import { UserSettingElement } from './@types/UserSettingElement'
import { useNavigate } from 'react-router-dom'
import { RouteNames, Theme } from 'common-types'
import { UIAvatar, UISwitch } from 'src/components/UI'

const methods: Array<UserSettingElement> = [
  { name: 'theme', method: changeTheme },
  { name: 'sound', method: setSoundValue },
  { name: 'tooltips', method: setTooltipsValue },
  { name: 'notification', method: setAbleToShowNotification }
]

const UserSettings = () => {
  const { username, email, id, avatarPath } = useTypedSelector((state) => state.user.userData)
  const { theme, soundOn, showTooltips, ableToShowNotification } = useTypedSelector((state) => state.persist.settings)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const changeUserData = () => {
    dispatch(showModal({ title: 'Update User Data', modalContentComponentName: 'UserDataSettingsPopup' }))
  }

  const changeSetting = (value: boolean, id: string) => {
    const method = methods.find((method) => method.name === id)?.method
    if (!method) return
    dispatch(method(value))
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
        <div className="link paragraph-text" onClick={() => navigate({ pathname: RouteNames.PASSWORD_RECOVERY })}>
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

export default UserSettings
