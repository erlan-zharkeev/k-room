
import type { IPickContactAvatarProps } from 'src/features/contact/pick-contact'

import { useLiveMediaUrl } from 'src/entities/media'

import { AppAvatar } from 'src/shared/ui'

export const ContactAvatar = ({ id }: IPickContactAvatarProps) => {
  const url = useLiveMediaUrl(`avatar.${id}`)
  return <AppAvatar src={url} showBadge={false} />
}
