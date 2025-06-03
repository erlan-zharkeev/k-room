import './style.scss'

import { PasswordRecoveryLink } from 'src/features/auth'
import { ProfileInfo } from 'src/features/profile-info'
import { OpenModalUpdateUserDataBtn } from 'src/features/user'

import { useUser } from 'src/entities/user'

import { AppText } from 'src/shared/ui'

export const UserProfileData = () => {
  const { id, username, email, avatarPath } = useUser()

  return (
    <div className="user-profile-data">
      <ProfileInfo
        title={username}
        description={email}
        avatarPath={avatarPath}
        showBadge={false}
        horizontal
        avatarSize="large"
      />
      <AppText size="small">#{id}</AppText>
      <OpenModalUpdateUserDataBtn />
      <PasswordRecoveryLink />
    </div>
  )
}
