import './style.scss'

import { PasswordRecoveryLink } from 'src/features/auth'

import { UserProfile, useUser } from 'src/entities/user'

import { AppText } from 'src/shared/ui'

import { OpenModalEditUserDataBtn } from '../../..'

export const UserProfileData = () => {
  const { id } = useUser()

  return (
    <div className="user-profile-data">
      <UserProfile horizontal avatarSize="large" />
      <AppText size="small">#{id}</AppText>
      <div className="user-profile-data__actions">
        <OpenModalEditUserDataBtn />
        <PasswordRecoveryLink />
      </div>
    </div>
  )
}
