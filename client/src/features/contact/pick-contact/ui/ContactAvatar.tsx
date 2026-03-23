import { useLiveMediaUrl } from 'src/entities/media'

import { AppAvatar } from 'src/shared/ui'

export const ContactAvatar = ({ id }: { id: string }) => {
  const url = useLiveMediaUrl(`avatar.${id}`)
  return <AppAvatar src={url} showBadge={false} />
}
