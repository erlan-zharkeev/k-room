import './style.scss'
import { WidgetWrapper } from '../WidgetWrapper/WidgetWrapper'
import { UserProfile } from 'src/entities/user'
import { InfoDropdown, LogoutButton } from 'src/features'

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
