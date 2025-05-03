import { ProfileInfo } from 'src/features/profile-info'

import { useUser } from '../../model'

export const UserProfile = () => {
  const { username, email, avatarPath } = useUser()
  return <ProfileInfo username={username} email={email} avatarPath={avatarPath} showBadge={false} />
}
