import { computed, toRef, watch } from 'vue'

import { useSyncMedia } from 'src/entities/media-file'
import { useLocalizedDateTime } from 'src/entities/setting'
import { useLiveMediaUrls } from 'src/shared/lib'

import type { MessageBodyProps } from '../config/types'

export const useMessageBody = (props: MessageBodyProps) => {
  const message = toRef(props, 'message')
  const { formatTime } = useLocalizedDateTime()
  const { sync } = useSyncMedia()

  const showAuthorNickname = computed(() => !props.isPrivateRoom && !message.value.isSelf)
  const messageImageList = computed(() =>
    (message.value.images ?? []).map((image) => ({
      ...image,
      mediaId: image.src
    }))
  )
  const resolveMessageImageIds = () => messageImageList.value.map(({ mediaId }) => mediaId)
  const messageImagePreviewUrlList = useLiveMediaUrls(resolveMessageImageIds)

  watch(
    resolveMessageImageIds,
    (mediaIds) => {
      mediaIds.forEach((mediaId) => {
        sync(mediaId)
      })
    },
    { immediate: true }
  )

  const sentAt = computed(() => {
    if (!message.value.createdAt) return ''
    return formatTime(message.value.createdAt)
  })

  return {
    showAuthorNickname,
    messageImagePreviewUrlList,
    sentAt
  }
}
