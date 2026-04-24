import './style.scss'

import { AppIcon, WidgetWrapper } from 'src/shared/ui'

import { ContentTab } from '../Navigation/ContentTab/ContentTab'
import { OpenDeviceSettingsButton } from '../Navigation/OpenDeviceSettingsButton/OpenDeviceSettingsButton'

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
