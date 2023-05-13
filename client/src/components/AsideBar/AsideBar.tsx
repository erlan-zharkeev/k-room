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

  const changTab = (e: RadioChangeEvent) => {
    const currentTabName = e.target.value
    dispatch(changeAsideTab(currentTabName))
  }

  const changeTabClickHandler = () => {
    if (viewPort.width <= 769) dispatch(selectChatRoom(''))
  }

  const buttons: Array<ButtonsListElement> = [
    { value: 'contacts', iconName: 'contacts' },
    { value: 'chatList', iconName: 'chats' },
    { value: 'calls', iconName: 'calls' },
    { value: 'settings', iconName: 'settings-cog' }
  ]

  const openTechSettings = () => {
    dispatch(showModal({ title: 'Settings', modalContentComponentName: 'TechSettingsPopup' }))
  }

  return (
    <div className="aside-bar">
      {viewPort.width >= 769 && <Logo />}
      <Radio.Group value={asideTab} onChange={changTab}>
        {buttons.map((button) => {
          return (
            <UIButton
              type="radio"
              key={button.value}
              onClick={changeTabClickHandler}
              value={button.value}
              iconName={button.iconName}
            />
          )
        })}
      </Radio.Group>
      {viewPort.width >= 769 && <UIButton iconName="settings-mixer" onClick={openTechSettings} />}
    </div>
  )
}

export default AsideBar
