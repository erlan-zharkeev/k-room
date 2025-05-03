import './style.scss'
import { AppAvatar, AppText } from 'src/shared/ui'

export const ProfileInfo = ({
  avatarPath,
  username,
  email,
  online,
  showBadge = true,
  horizontal = false,
  avatarSize = 'small'
}: {
  avatarPath?: string
  username: string
  email: string
  online?: boolean
  showBadge?: boolean
  horizontal?: boolean
  avatarSize?: 'small' | 'large'
}) => {
  return (
    <div className={`profile-info${horizontal ? ' profile-info--horizontal' : ''}`}>
      <AppAvatar online={online} src={avatarPath} showBadge={showBadge} size={avatarSize} />
      <div className="profile-info__credential">
        <AppText tag="p" size="sm">
          {username}
        </AppText>
        <AppText tag="p" size="sm">
          {email}
        </AppText>
      </div>
    </div>
  )
}
