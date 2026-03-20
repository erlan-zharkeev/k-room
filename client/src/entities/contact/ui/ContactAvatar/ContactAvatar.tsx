import { useMedia } from 'src/entities/media'

import { AppAvatar } from 'src/shared/ui'

import { useContact } from '../../hooks'

export const ContactAvatar = ({ id, showBadge = true }: { id: string; showBadge?: boolean }) => {
  const { contacts } = useContact()
  const { getLiveMedia } = useMedia()
  const contact = contacts.find((contact) => contact.id === id)
  const avatar = getLiveMedia(`avatar.${id}`)

  return (
    <AppAvatar
      showBadge={showBadge}
      online={contact?.online}
      stubIconName="user-stub"
      src={avatar}
      shape="circle-shape"
    />
  )
}
