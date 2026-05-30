import { computed, toRef, watch } from 'vue'

import { useSyncMedia } from 'src/entities/media-file'

import type { MessageLinkPreviewProps } from '../config/types'
import { canShowMessageLinkPreview, resolveMessageLinkPreviewTitle } from '../lib/message-link-preview'

export const useMessageLinkPreview = (props: MessageLinkPreviewProps) => {
  const preview = toRef(props, 'preview')
  const { sync } = useSyncMedia()

  const previewImage = computed(() => preview.value.image)
  const previewImageId = computed(() => previewImage.value?.src)
  const previewTitle = computed(() => resolveMessageLinkPreviewTitle(preview.value))
  const canShowPreview = computed(() => canShowMessageLinkPreview(preview.value))

  watch(
    previewImageId,
    (mediaId) => {
      if (!mediaId) return

      sync(mediaId)
    },
    { immediate: true }
  )

  return {
    canShowPreview,
    previewImage,
    previewTitle
  }
}
