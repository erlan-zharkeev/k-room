import { Radio, RadioChangeEvent } from 'antd'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { AppDispatch } from 'src/store'
import { changeAsideTab, selectChatRoom } from 'src/store/settingsSlice'
import ButtonsListElement from './@types/ButtonsListElement'
import UIButton from 'ui/UIButton'
import { Logo } from '../Common/Logo/Logo'
import { showModal } from 'src/store/systemSlice'

const AsideBar = () => {
  const { asideTab } = useTypedSelector((state) => state.persist.settings)
  const dispatch = useDispatch<AppDispatch>()
  const { viewPort } = useTypedSelector((state) => state.system)

  const changeTab = (e: RadioChangeEvent) => {
    const currentTabName = e.target.value
    dispatch(changeAsideTab(currentTabName))
  }

  const changeTabClickHandler = () => {
    if (viewPort.width <= 769) dispatch(selectChatRoom(''))
  }

  const buttons: Array<ButtonsListElement> = [
    { value: 'contacts', iconName: 'contacts', tooltip: 'Contacts' },
    { value: 'chatList', iconName: 'chats', tooltip: 'Chats' },
    { value: 'calls', iconName: 'calls', tooltip: 'Calls' },
    { value: 'settings', iconName: 'settings-cog', tooltip: 'Settings' }
  ]

  const openTechSettings = () => {
    dispatch(showModal({ title: 'Settings', modalContentComponentName: 'TechSettingsPopup' }))
  }

  return (
    <div className="aside-bar">
      {viewPort.width >= 769 && <Logo />}
      <Radio.Group value={asideTab} onChange={changeTab}>
        {buttons.map((button) => {
          return (
            <UIButton
              type="radio"
              key={button.value}
              onClick={changeTabClickHandler}
              value={button.value}
              iconName={button.iconName}
              tooltip={button.tooltip}
            />
          )
        })}
      </Radio.Group>
      {viewPort.width >= 769 && <UIButton iconName="settings-mixer" onClick={openTechSettings} tooltip="Mixer" />}
    </div>
  )
}

export default AsideBar
