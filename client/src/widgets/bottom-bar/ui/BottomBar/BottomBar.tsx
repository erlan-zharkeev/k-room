import './style.scss'

import { ContentTab } from 'src/features/contact-tab'
import { OpenDeviceSettingsButton } from 'src/features/device-settings'

import { WidgetWrapper } from 'src/shared/ui'

export const BottomBar = () => {
  return (
    <WidgetWrapper name="bottom-bar">
      <div className="bottom-bar__wrapper">
        <ContentTab />
        <OpenDeviceSettingsButton />
      </div>
    </WidgetWrapper>
  )
}
