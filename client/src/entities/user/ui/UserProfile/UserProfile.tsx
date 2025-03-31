import { socket } from 'src/shared/api'
import { useUser } from '../../model'
import { ContactInfo } from 'src/features/contact/contact-info'

export const UserProfile = () => {
  const { username, email, avatarPath } = useUser()
  return <ContactInfo username={username} email={email} avatarPath={avatarPath} online={socket.connected} />
}
