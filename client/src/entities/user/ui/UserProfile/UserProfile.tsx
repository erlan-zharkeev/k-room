import { socket } from 'src/shared/api'
import { ProfileInfo } from 'src/shared/ui'
import { useUser } from '../../model'

export const UserProfile = () => {
  const { username, email, avatarPath } = useUser()
  return <ProfileInfo username={username} email={email} avatarPath={avatarPath} online={socket.connected} />
}
