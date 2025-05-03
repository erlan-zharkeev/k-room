import './style.scss'

import { PasswordRecoveryLink } from 'src/features/password-recovery'
import { ProfileInfo } from 'src/features/profile-info'
import { OpenModalUpdateUserDataBtn } from 'src/features/update-user-data'

import { useUser } from 'src/entities/user'

export const UserProfileData = () => {
  const { id, username, email, avatarPath } = useUser()

  return (
    <div className="user-profile-data">
      <ProfileInfo
        username={username}
        email={email}
        avatarPath={avatarPath}
        showBadge={false}
        horizontal
        avatarSize="large"
      />
      <span className="user-profile-data__id paragraph-text paragraph-text-sm">#{id}</span>
      <OpenModalUpdateUserDataBtn />
      <PasswordRecoveryLink />
    </div>
  )
}
