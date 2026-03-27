import { useContact } from 'src/entities/contact'
import type { IContactAvatarProps } from 'src/entities/contact/ui/ContactAvatar/config'
import { useMedia } from 'src/entities/media'

import { AppAvatar } from 'src/shared/ui'

export const ContactAvatar = ({ id, showBadge = true }: IContactAvatarProps) => {
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
