import { AppAvatar } from 'src/shared/ui'
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
    <AppAvatar
      showBadge={false}
      online={isAnyUserOnline(room)}
      stubIconName="image-stub"
      src={room.avatarPath}
      shape="circle-shape"
    />
  ) : (
    <ContactAvatar id={room.users[0].id} />
  )
}
