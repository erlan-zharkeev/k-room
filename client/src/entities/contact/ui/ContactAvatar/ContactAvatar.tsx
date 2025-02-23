import { Avatar } from 'src/shared/ui'
import { useTypedSelector } from 'src/shared/lib'

export const ContactAvatar = ({ id, showBadge = true }: { id: string; showBadge?: boolean }) => {
  const { contacts } = useTypedSelector((state) => state.contacts)
  const contact = contacts.find((contact) => contact.id === id)

  return (
    <Avatar
      showBadge={showBadge}
      online={contact?.online}
      stubIconName={'user-stub'}
      src={contact?.avatarPath}
      shape={'round'}
    />
  )
}
