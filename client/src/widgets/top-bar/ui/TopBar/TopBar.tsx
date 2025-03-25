import './style.scss'
import { UserProfile } from 'src/entities/user'
import { InfoDropdown } from 'src/features/info-dropdown'
import { LogoutButton } from 'src/features/logout'
import { WidgetWrapper } from 'src/widgets/widget-wrapper'

export const TopBar = () => {
  return (
    <div className="top-bar">
      <WidgetWrapper placement="top">
        <div className="top-bar__content">
          <UserProfile />
          <div className="top-bar__action-btns">
            <InfoDropdown />
            <LogoutButton />
          </div>
        </div>
      </WidgetWrapper>
    </div>
  )
}
