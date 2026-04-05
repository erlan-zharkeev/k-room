import { IContactAvatarProps, useContact } from 'src/entities/contact'
import { useMedia } from 'src/entities/media'

import { AppAvatar } from 'src/shared/ui'

export const ContactAvatar = ({ id, showBadge = true }: IContactAvatarProps) => {
  const { contacts } = useContact()
  const { getLiveMediaUrl } = useMedia()
  const contact = contacts.find((contact) => contact.id === id)
  const avatar = getLiveMediaUrl(`avatar.${id}`)

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
