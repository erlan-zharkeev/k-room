import './style.scss'

import { PasswordRecoveryLink } from 'src/features/auth'
import { ProfileInfo } from 'src/entities/profile-info'
import { OpenModalUpdateUserDataBtn } from 'src/features/user'

import { useUser } from 'src/entities/user'

import { AppText } from 'src/shared/ui'

export const UserProfileData = () => {
  const { id, username, email, avatar } = useUser()

  return (
    <div className="user-profile-data">
      <ProfileInfo
        title={username}
        description={email}
        avatar={avatar}
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
