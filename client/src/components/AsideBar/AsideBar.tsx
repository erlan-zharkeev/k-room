import { RadioChangeEvent, Radio } from 'antd'
import { AsideBarButtonName, UserSettingKey, MessageStatus } from 'common-types'
import { useDispatch } from 'react-redux'
import { useUpdateSettings, useTypedSelector } from 'src/hooks'
import { AppDispatch, selectChatRoom, showModal } from 'src/store'
import { ModalContentComponentName, ViewPortWidthType } from 'src/@types'
import { IconName, UIButton, Logo } from '..'

export interface ButtonsListElement {
  value: AsideBarButtonName
  iconName: IconName
  tooltip?: string
}

export const AsideBar = () => {
  const { updateSetting } = useUpdateSettings()
  const { asideTab } = useTypedSelector((state) => state.persist.settings)
  const dispatch = useDispatch<AppDispatch>()
  const { viewPort } = useTypedSelector((state) => state.system)
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const changeTab = (e: RadioChangeEvent) => {
    const currentTabName = e.target.value
    updateSetting(UserSettingKey.asideTab, { asideTab: currentTabName })
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
        <UIButton iconName="thunder" color="accent" onClick={openTechSettings} tooltip="Check devices" />
      )}
    </div>
  )
}
