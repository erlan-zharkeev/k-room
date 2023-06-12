import { Badge, Radio, RadioChangeEvent } from 'antd'
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
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)

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

  const getButtonComponent = (button: ButtonsListElement) => (
    <UIButton
      type="radio"
      onClick={changeTabClickHandler}
      value={button.value}
      iconName={button.iconName}
      tooltip={button.tooltip}
    />
  )

  const unreadMessagesCount = () => {
    let result = 0
    chatRooms.forEach((room) =>
      room.messages.forEach((message) => {
        if (message.status === 'delivered' && !message.isSelf) result += 1
      })
    )
    return result
  }

  return (
    <div className="aside-bar">
      {viewPort.width >= 769 && <Logo />}
      <Radio.Group value={asideTab} onChange={changeTab}>
        {buttons.map((button) => {
          return button.value === 'chatList' ? (
            <Badge count={unreadMessagesCount()} key={button.value} size="small">
              {getButtonComponent(button)}
            </Badge>
          ) : (
            <div key={button.value}>{getButtonComponent(button)}</div>
          )
        })}
      </Radio.Group>
      {viewPort.width >= 769 && <UIButton iconName="settings-mixer" onClick={openTechSettings} tooltip="Mixer" />}
    </div>
  )
}

export default AsideBar
