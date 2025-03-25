import appData from './../../../../../../../package.json'
import './style.scss'
import Meta from 'antd/lib/card/Meta'
import { RouteNames, UserSettings as IUserSettings } from 'common-types'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTypedSelector } from 'src/shared/lib'
import { AppDispatch } from 'src/app/store'
import { AppAvatar, AppSwitch } from 'src/shared/ui'
import { showModal } from 'src/entities/system'
import { useSettings } from 'src/entities/settings'

const { VITE_MAIL_APP } = import.meta.env

export const UserSettings = () => {
  const { username, email, id, avatarPath } = useTypedSelector((state) => state.user.userData)
  const { theme, soundOn, showTooltips, ableToShowNotification, showWallpaper } = useTypedSelector(
    (state) => state.persist.settings
  )
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { allowAudioContext } = useTypedSelector((state) => state.system)
  const { updateSetting } = useSettings()

  const changeUserData = () => {
    dispatch(
      showModal({
        title: 'Update User Data',
        modalContentComponentName: 'user-data-settings-popup'
      })
    )
  }

  const changeSetting = (value: boolean, id: string) => {
    let type: keyof IUserSettings | null = null
    switch (id) {
      case 'theme':
        type = 'theme'
        break
      case 'sound':
        type = 'soundOn'
        break
      case 'tooltips':
        type = 'showTooltips'
        break
      case 'notification':
        type = 'ableToShowNotification'
        break
      case 'wallpaper':
        type = 'showWallpaper'
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
            avatar={<AppAvatar size="middle" showBadge={false} src={avatarPath} />}
            title={username}
            description={email}
          />
          <span className="user-settings__id paragraph-text paragraph-text-sm ">#{id}</span>
        </div>
        <div
          className="link paragraph-text user-settings__password-recovery"
          onClick={() => navigate({ pathname: RouteNames.PasswordRecovery, search: `?user-email=${email}` })}
        >
          Password recovery
        </div>
        <div className="user-settings__theme-switch">
          <div className="user-settings__title paragraph-text ">Theme</div>
          <AppSwitch onText="Dark" id="theme" offText="Light" initValue={theme === 'dark'} onChange={changeSetting} />
        </div>
        <div className="user-settings__sound-switch">
          <div className="user-settings__title paragraph-text ">Sound</div>
          <AppSwitch initValue={soundOn} id="sound" onChange={changeSetting} disabled={!allowAudioContext} />
          {!allowAudioContext && (
            <div className="user-settings__additional-setting-info">
              The browser requires some kind of user action to activate the sound. Click anywhere to activate the audio
              context.
            </div>
          )}
        </div>
        <div className="user-settings__tooltip-switch">
          <div className="user-settings__title paragraph-text ">Tooltips</div>
          <AppSwitch initValue={showTooltips} id="tooltips" onText="Show" offText="Hide" onChange={changeSetting} />
        </div>
        <div className="user-settings__wallpaper-switch">
          <div className="user-settings__title paragraph-text ">Wallpaper</div>
          <AppSwitch initValue={showWallpaper} id="wallpaper" onText="Show" offText="Hide" onChange={changeSetting} />
        </div>
        <div className="user-settings__notification-switch">
          <div className="user-settings__title paragraph-text ">Notification</div>
          <AppSwitch
            initValue={ableToShowNotification}
            id="notification"
            onText="Show"
            offText="Hide"
            onChange={changeSetting}
          />
          {
            <div className="user-settings__additional-setting-info">
              If you want to disable/enable browser notifications, you need to do this manually (the setting next to the
              address bar), the security policy does not allow you to do this from the application interface. The
              current setting is responsible for notification toasts inside the app.
            </div>
          }
        </div>
      </div>
      <div className="user-settings__info">
        <a className="link paragraph-text" href={`mailto:${VITE_MAIL_APP}?subject=Support%20Request(${id})`}>
          Tech support
        </a>
        <a className="link paragraph-text" onClick={() => navigate(RouteNames.PrivacyPolicy)}>
          Privacy policy
        </a>
        <div className="user-settings__app-name paragraph-text paragraph-text-sm ">{appData.name}</div>
        <div className="user-settings__version paragraph-text paragraph-text-sm ">v.{appData.version}</div>
      </div>
    </div>
  )
}
