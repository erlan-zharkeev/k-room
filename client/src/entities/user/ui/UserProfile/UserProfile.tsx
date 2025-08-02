import { ProfileInfo } from 'src/entities/profile-info'

import { useUser } from '../../model'

export const UserProfile = () => {
  const { username, email, avatarPath } = useUser()
  return <ProfileInfo title={username} description={email} avatarPath={avatarPath} showBadge={false} />
}
