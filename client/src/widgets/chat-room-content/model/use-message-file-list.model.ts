import { computed } from 'vue'

import { useLiveMediaUrlMap } from 'src/shared/lib'

import type { MessageFileListProps } from '../config/types'

export const useMessageFileList = (props: MessageFileListProps) => {
  const fileIds = computed(() => props.files.map(({ src }) => src))
  const mediaUrlById = useLiveMediaUrlMap(() => fileIds.value)
  const fileItems = computed(() =>
    props.files.flatMap(({ contentType, name, size, src }) => {
      const mediaUrl = mediaUrlById.value.get(src)
      const shouldWaitForPreview = props.mediaPreview === 'audio' && !mediaUrl

      if (shouldWaitForPreview) return []

      return [
        {
          id: src,
          name,
          contentType,
          size,
          downloadHref: mediaUrl,
          previewSrc: mediaUrl,
          mediaPreview: props.mediaPreview
        }
      ]
    })
  )
  const hasFileItems = computed(() => Boolean(fileItems.value.length))

  return {
    fileItems,
    hasFileItems
  }
}
