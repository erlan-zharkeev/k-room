import './style.scss'
import { Logo } from 'src/shared/ui'
import { WidgetWrapper } from '../WidgetWrapper/WidgetWrapper'
import { useViewport } from 'src/entities/system'
import { AsideNavigation } from 'src/features/aside-navigation'
import { CheckDevicesButton } from 'src/entities/devices'

export const AsideBar = () => {
  const { greaterOrEqualTablet } = useViewport()
  return (
    <div className="aside-bar">
      <WidgetWrapper placement="bar">
        <div className="aside-bar__wrapper">
          {greaterOrEqualTablet && <Logo showPointer={false} />}
          <AsideNavigation />
          <CheckDevicesButton />
        </div>
      </WidgetWrapper>
    </div>
  )
}
