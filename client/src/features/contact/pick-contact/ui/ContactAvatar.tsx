
import { useLiveMediaUrl } from 'src/entities/media'

import { AppAvatar } from 'src/shared/ui'

import type { IPickContactAvatarProps } from '..'

export const ContactAvatar = ({ id }: IPickContactAvatarProps) => {
  const url = useLiveMediaUrl(`avatar.${id}`)
  return <AppAvatar src={url} showBadge={false} />
}
