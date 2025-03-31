import './style.scss'
import { AppAvatar } from 'src/shared/ui'

export const ContactInfo = ({
  avatarPath,
  username,
  email,
  online,
  showBadge = true
}: {
  avatarPath?: string
  username: string
  email: string
  online: boolean
  showBadge?: boolean
}) => {
  return (
    <div className="contact-info">
      <AppAvatar online={online} src={avatarPath} showBadge={showBadge} />
      <div className="contact-info__credential">
        <div className="paragraph-text contact-info__username">{username}</div>
        <div className="paragraph-text ">{email}</div>
      </div>
    </div>
  )
}
