import './style.scss'
import { AppIcon } from 'src/shared/ui'
import { ContentTab } from 'src/features/content-tab'
import { CheckDevicesButton } from 'src/entities/devices'
import { WidgetWrapper } from 'src/widgets/widget-wrapper'

export const AsideBar = () => {
  return (
    <div className="aside-bar">
      <WidgetWrapper placement="aside-bar">
        <div className="aside-bar__wrapper">
          <AppIcon name="logo" size="medium" />
          <ContentTab />
          <CheckDevicesButton />
        </div>
      </WidgetWrapper>
    </div>
  )
}
