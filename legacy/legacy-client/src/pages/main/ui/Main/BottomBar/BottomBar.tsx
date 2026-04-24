import './style.scss'

import { WidgetWrapper } from 'src/shared/ui'

import { ContentTab } from '../Navigation/ContentTab/ContentTab'
import { OpenDeviceSettingsButton } from '../Navigation/OpenDeviceSettingsButton/OpenDeviceSettingsButton'

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
