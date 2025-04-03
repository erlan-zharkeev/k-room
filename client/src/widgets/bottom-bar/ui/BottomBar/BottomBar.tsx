import './style.scss'
import { ContentTab } from 'src/features/content-tab'
import { CheckDevicesButton } from 'src/entities/devices'
import { WidgetWrapper } from 'src/widgets/widget-wrapper'

export const BottomBar = () => {
  return (
    <div className="bottom-bar">
      <WidgetWrapper placement="bottom-bar">
        <div className="bottom-bar__wrapper">
          <ContentTab />
          <CheckDevicesButton />
        </div>
      </WidgetWrapper>
    </div>
  )
}
