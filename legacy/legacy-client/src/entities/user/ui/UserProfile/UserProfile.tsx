import { IUserProfileProps } from 'src/entities/user/ui/UserProfile/types'
import { useUser } from 'src/entities/user/model/use-user'

import { ProfileInfo } from 'src/shared/ui'

export const UserProfile = ({ avatarPath, ...props }: IUserProfileProps) => {
  const { username, email } = useUser()

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
