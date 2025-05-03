import './style.scss'
import { WidgetWrapper } from 'src/widgets/widget-wrapper'

import { ContentTab } from 'src/features/content-tab'
import { OpenDeviceSettingsButton } from 'src/features/device'

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
