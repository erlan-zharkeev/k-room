import type { MediaObject } from 'global-shared'
import { toValue, type MaybeRefOrGetter } from 'vue'

import { useLiveMediaUrl } from 'src/shared/lib'

export const useMessageMediaCard = <Media extends MediaObject>(media: MaybeRefOrGetter<Media>) => {
  const mediaUrl = useLiveMediaUrl(() => toValue(media).src)

  return {
    mediaUrl
  }
}
