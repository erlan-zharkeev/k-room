import { ProfileInfo } from 'src/entities/profile-info'

import { useUser } from '../../model'

export const UserProfile = () => {
  const { username, email, avatar } = useUser()
  return <ProfileInfo title={username} description={email} avatar={avatar} showBadge={false} />
}
