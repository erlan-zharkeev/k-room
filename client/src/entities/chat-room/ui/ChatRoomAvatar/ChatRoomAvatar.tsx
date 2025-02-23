import { Avatar } from 'src/shared/ui'
import { ChatRoom } from 'common-types'
import { ContactAvatar } from 'src/entities/contact'
import { useTypedSelector } from 'src/shared/lib'

export const ChatRoomAvatar = ({ room }: { room: ChatRoom }) => {
  const { contacts } = useTypedSelector((state) => state.contacts)

  const isAnyUserOnline = (chatRoom: ChatRoom) => {
    return chatRoom.users.some((user) => {
      return contacts.find((contact) => contact.id === user.id)?.online
    })
  }

  return room.multiple ? (
    <Avatar
      showBadge={false}
      online={isAnyUserOnline(room)}
      stubIconName={'image-stub'}
      src={room.avatarPath}
      shape={'square'}
    />
  ) : (
    <ContactAvatar id={room.users[0].id} />
  )
}
