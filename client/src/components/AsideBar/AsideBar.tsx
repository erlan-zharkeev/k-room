import { RadioChangeEvent, Radio, Badge } from 'antd'
import { AsideBarButtonName } from 'common-types'
import { useDispatch } from 'react-redux'
import { useUpdateSettings, useTypedSelector } from 'src/hooks'
import { AppDispatch, selectChatRoom, showModal } from 'src/store'
import { IconName, UIButton, Logo } from '..'
import { WidgetWrapper } from '../shared'
import { useEffect, useState } from 'react'
import { ModalContentComponentName, ViewPortWidthType } from 'src/@enums'

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
  const modalAppearance = useTypedSelector((state) => state.system.showModal)
  const { showCallModal } = useTypedSelector((state) => state.calls)
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { role } = useTypedSelector((state) => state.user.userData)

  const changeTab = (e: RadioChangeEvent) => {
    const currentTabName = e.target.value
    updateSetting('asideTab', { asideTab: currentTabName })
  }

  const changeTabClickHandler = () => {
    if (viewPort.width <= ViewPortWidthType.Tablet) dispatch(selectChatRoom(''))
  }

  const buttons: Array<ButtonsListElement> = [
    { value: 'contacts', iconName: 'contacts', tooltip: 'Contacts' },
    { value: 'chat-list', iconName: 'chats', tooltip: 'Chats' },
    { value: 'calls', iconName: 'calls', tooltip: 'Calls' },
    { value: 'settings', iconName: 'settings-cog', tooltip: 'Settings' }
  ]

  const openTechSettings = () => {
    dispatch(
      showModal({
        title: 'Settings',
        modalContentComponentName: ModalContentComponentName.TechSettingsPopup
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
        if (message.status === 'delivered' && !message.isSelf) result += 1
      })
    )
    return result
  }

  const [buttonElements, setButtonElements] = useState(buttons)

  useEffect(() => {
    if (role === 'admin' && !Boolean(buttons.find((button) => button.value === 'admin-panel'))) {
      setButtonElements((buttons) => [{ value: 'admin-panel', iconName: 'shield', tooltip: 'Admin panel' }, ...buttons])
    }
  }, [role])

  return (
    <div className="aside-bar">
      <WidgetWrapper wallpaperPlacement="left">
        <div className="aside-bar__wrapper">
          {viewPort.width >= ViewPortWidthType.Tablet && <Logo showPointer={false} />}
          <Radio.Group value={asideTab} onChange={changeTab}>
            {buttonElements.map((button) => (
              <div key={button.value} className="aside-bar__button-el">
                <Badge
                  color="var(--accent)"
                  count={button.value === 'chat-list' && unreadMessagesCount() > 0 ? 1 : 0}
                  size="small"
                  offset={[-15, 10]}
                >
                  {getButtonComponent(button)}
                </Badge>
              </div>
            ))}
          </Radio.Group>
          {viewPort.width >= ViewPortWidthType.Tablet && (
            <UIButton
              iconName="thunder"
              color="accent"
              onClick={openTechSettings}
              tooltip="Check devices"
              disabled={modalAppearance || showCallModal}
            />
          )}
        </div>
      </WidgetWrapper>
    </div>
  )
}
