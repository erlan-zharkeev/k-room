import './style.scss'

import { OpenModalEditUserDataBtn } from 'src/features/edit-user-data'
import { PasswordRecoveryLink } from 'src/features/password-recovery'

import { useLiveMediaUrl } from 'src/entities/media-file'
import { UserProfile, useUser } from 'src/entities/user'

import { AppText } from 'src/shared/ui'

export const UserProfileData = () => {
  const { id } = useUser()
  const avatarPath = useLiveMediaUrl(`avatar.${id}`)

  return (
    <div className="user-profile-data">
      <UserProfile avatarPath={avatarPath} horizontal avatarSize="large" />
      <AppText size="small">#{id}</AppText>
      <div className="user-profile-data__actions">
        <OpenModalEditUserDataBtn />
        <PasswordRecoveryLink />
      </div>
    </div>
  )
}
