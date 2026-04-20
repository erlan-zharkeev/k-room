import './style.scss'

import { ContentTab } from 'src/features/contact-tab'
import { OpenDeviceSettingsButton } from 'src/features/device-settings'

import { AppIcon, WidgetWrapper } from 'src/shared/ui'

export const AsideBar = () => {
  return (
    <WidgetWrapper name="aside-bar">
      <div className="aside-bar__wrapper">
        <AppIcon name="logo" size="medium" />
        <ContentTab />
        <OpenDeviceSettingsButton />
      </div>
    </WidgetWrapper>
  )
}
