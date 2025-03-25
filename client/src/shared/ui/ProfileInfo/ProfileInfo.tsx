import './style.scss'
import { AppAvatar } from 'src/shared/ui'

export const ProfileInfo = ({
  avatarPath,
  username,
  email,
  online,
  showBadge = true
}: {
  avatarPath: string
  username: string
  email: string
  online: boolean
  showBadge?: boolean
}) => {
  return (
    <div className="profile-info">
      <AppAvatar online={online} src={avatarPath} showBadge={showBadge} />
      <div className="profile-info__credential">
        <div className="paragraph-text profile-info__username">{username}</div>
        <div className="paragraph-text ">{email}</div>
      </div>
    </div>
  )
}
