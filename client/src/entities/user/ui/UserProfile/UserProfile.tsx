import { ProfileInfo } from 'src/entities/profile-info'

import { IUserProfileProps } from '..'
import { useUser } from '../..'

export const UserProfile = (props: IUserProfileProps) => {
  const { username, email, avatarPath } = useUser()

  return (
    <ProfileInfo
      title={username}
      description={email}
      avatar={avatarPath}
      showBadge={false}
      horizontal={props.horizontal}
      avatarSize={props.avatarSize}
    />
  )
}
