import './style.scss'
import { WidgetWrapper } from 'src/widgets/widget-wrapper'

import { ContentTab } from 'src/features/content-tab'
import { OpenDeviceSettingsButton } from 'src/features/device'

import { AppIcon } from 'src/shared/ui'

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
