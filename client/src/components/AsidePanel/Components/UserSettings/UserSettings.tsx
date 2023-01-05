import { Avatar, Switch, Tooltip } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import Meta from 'antd/lib/card/Meta'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { AppDispatch } from 'src/store'
import {
  showModal,
  changeTheme,
  setSoundValue,
  setTooltipsValue,
  setAbleToShowNotification,
  updateUserSettings
} from 'src/store/systemSlice'
import appData from '../../../../../package.json'

const UserSettings = () => {
  const { username, email, id, avatar } = useTypedSelector((state) => state.auth.userData)
  const { theme, soundOn, showTooltips, ableToShowNotification } = useTypedSelector(
    (state) => state.persist.system.settings
  )
  const dispatch = useDispatch<AppDispatch>()

  const changeUserData = () => {
    dispatch(showModal({ title: 'Update User Data', modalContentComponentName: 'UserDataSettingsPopup' }))
  }

  const SettingsElement = (
    <div className="user-settings__user-card" onClick={changeUserData}>
      <Meta
        avatar={<Avatar size="large" src={avatar} icon={<UserOutlined />} />}
        title={username}
        description={email}
      />
      <span className="user-settings__id paragraph-text paragraph-text-sm paragraph-text--secondary">{id}</span>
    </div>
  )

  const changeSettings = async (type: string, value: boolean) => {
    let convertedValue: boolean | string = value
    let action = null
    switch (type) {
      case 'theme':
        action = changeTheme(value)
        convertedValue = value ? 'dark' : 'light'
        break
      case 'sound':
        action = setSoundValue(value)
        break
      case 'tooltip':
        action = setTooltipsValue(value)
        break
      case 'notification':
        action = setAbleToShowNotification(value)
        break
      default:
        break
    }
    dispatch(action)
    await dispatch(
      updateUserSettings({
        userId: id,
        type,
        value: convertedValue
      })
    )
  }

  return (
    <div className="user-settings">
      <div className="user-settings__body">
        {showTooltips ? (
          <Tooltip placement="bottom" title="Change Settings">
            {SettingsElement}
          </Tooltip>
        ) : (
          SettingsElement
        )}
        <div className="user-settings__theme-switch">
          <div className="user-settings__title header-text header-text--sm header-text--secondary">Theme</div>
          <Switch
            checkedChildren={'Dark'}
            unCheckedChildren={'Light'}
            defaultChecked={theme === 'dark'}
            onChange={(value) => changeSettings('theme', value)}
          />
        </div>
        <div className="user-settings__sound-switch">
          <div className="user-settings__title header-text header-text--sm header-text--secondary">Sound</div>
          <Switch
            checkedChildren={'On'}
            unCheckedChildren={'Off'}
            defaultChecked={soundOn}
            onChange={(value) => changeSettings('sound', value)}
          />
        </div>
        <div className="user-settings__tooltip-switch">
          <div className="user-settings__title header-text header-text--sm header-text--secondary">Tooltips</div>
          <Switch
            checkedChildren={'Show'}
            unCheckedChildren={'Hide'}
            defaultChecked={showTooltips}
            onChange={(value) => changeSettings('tooltip', value)}
          />
        </div>
        <div className="user-settings__tooltip-switch">
          <div className="user-settings__title header-text header-text--sm header-text--secondary">Notification</div>
          <Switch
            checkedChildren={'Show'}
            unCheckedChildren={'Hide'}
            defaultChecked={ableToShowNotification}
            onChange={(value) => changeSettings('notification', value)}
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
