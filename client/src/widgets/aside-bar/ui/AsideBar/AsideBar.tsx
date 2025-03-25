import './style.scss'
import { AppIcon } from 'src/shared/ui'
import { useViewport } from 'src/entities/system'
import { AsideNavigation } from 'src/features/aside-navigation'
import { CheckDevicesButton } from 'src/entities/devices'
import { WidgetWrapper } from 'src/widgets/widget-wrapper'

export const AsideBar = () => {
  const { greaterOrEqualTablet } = useViewport()

  return (
    <div className="aside-bar">
      <WidgetWrapper placement="bar">
        <div className="aside-bar__wrapper">
          {greaterOrEqualTablet && <AppIcon name="logo" size="medium" />}
          <AsideNavigation />
          <CheckDevicesButton />
        </div>
      </WidgetWrapper>
    </div>
  )
}
