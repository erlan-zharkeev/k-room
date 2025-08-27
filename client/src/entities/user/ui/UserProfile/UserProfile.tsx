import { useGetMedia } from 'src/features/media'

import { ProfileInfo } from 'src/entities/profile-info'
import { useUser } from 'src/entities/user'

import { IUserProfileProps } from './types'

export const UserProfile = (props: IUserProfileProps) => {
  const { username, email, id } = useUser()
  const src = useGetMedia(id, 'avatar')

  return (
    <ProfileInfo
      title={username}
      description={email}
      avatar={src}
      showBadge={false}
      horizontal={props.horizontal}
      avatarSize={props.avatarSize}
    />
  )
}
