import { Radio, RadioChangeEvent } from 'antd'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { AppDispatch } from 'src/store'
import { changeAsideTab, selectChatRoom } from 'src/store/settingsSlice'
import { ButtonsListElement } from './@types/ButtonsListElement'
import { Logo } from '../Common/Logo/Logo'
import { showModal } from 'src/store/systemSlice'
import { AsideBarButtonName, MessageStatus } from 'common-types'
import { UIButton } from '../UI'
import { ModalContentComponentName } from '../Common/Popup/@types'
import { ViewPortWidthType } from 'src/store/@types/SystemState'

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
    if (viewPort.width <= ViewPortWidthType.tablet) dispatch(selectChatRoom(''))
  }

  const buttons: Array<ButtonsListElement> = [
    { value: AsideBarButtonName.contacts, iconName: 'contacts', tooltip: 'Contacts' },
    { value: AsideBarButtonName.chatList, iconName: 'chats', tooltip: 'Chats' },
    { value: AsideBarButtonName.calls, iconName: 'calls', tooltip: 'Calls' },
    { value: AsideBarButtonName.settings, iconName: 'settings-cog', tooltip: 'Settings' }
  ]

  const openTechSettings = () => {
    dispatch(
      showModal({
        title: 'Settings',
        modalContentComponentName: ModalContentComponentName.techSettingsPopup
      })
    )
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
        if (message.status === MessageStatus.delivered && !message.isSelf) result += 1
      })
    )
    return result
  }

  return (
    <div className="aside-bar">
      {viewPort.width >= ViewPortWidthType.tablet && <Logo />}
      <Radio.Group value={asideTab} onChange={changeTab}>
        {buttons.map((button) => (
          <div key={button.value} className="aside-bar__button-el">
            {getButtonComponent(button)}
            {button.value === AsideBarButtonName.chatList && unreadMessagesCount() > 0 && (
              <div className="custom-badge">{unreadMessagesCount()}</div>
            )}
          </div>
        ))}
      </Radio.Group>
      {viewPort.width >= ViewPortWidthType.tablet && (
        <UIButton iconName="settings-mixer" onClick={openTechSettings} tooltip="Mixer" />
      )}
    </div>
  )
}

export default AsideBar
