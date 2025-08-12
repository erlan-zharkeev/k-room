import { useTypedSelector } from 'src/shared/lib'
import { AppAvatar } from 'src/shared/ui'

export const ContactAvatar = ({ id, showBadge = true }: { id: string; showBadge?: boolean }) => {
  const { contacts } = useTypedSelector((state) => state.contacts)
  const contact = contacts.find((contact) => contact.id === id)

  return (
    <AppAvatar
      showBadge={showBadge}
      online={contact?.online}
      stubIconName="user-stub"
      src={contact?.avatar}
      shape="circle-shape"
    />
  )
}
