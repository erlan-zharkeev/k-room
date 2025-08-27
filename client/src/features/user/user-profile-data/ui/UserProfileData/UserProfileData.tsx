import './style.scss'

import { PasswordRecoveryLink } from 'src/features/auth'
import { OpenModalUpdateUserDataBtn } from 'src/features/user'

import { UserProfile, useUser } from 'src/entities/user'

import { AppText } from 'src/shared/ui'

export const UserProfileData = () => {
  const { id } = useUser()

  return (
    <div className="user-profile-data">
      <UserProfile horizontal avatarSize="large" />
      <AppText size="small">#{id}</AppText>
      <OpenModalUpdateUserDataBtn />
      <PasswordRecoveryLink />
    </div>
  )
}
