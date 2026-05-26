import { computed, toRef, watch } from 'vue'

import { useSyncMedia } from 'src/entities/media-file'
import { useLocalizedDateTime } from 'src/entities/setting'

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

  watch(
    messageImageList,
    (images) => {
      images.forEach(({ mediaId }) => {
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
    messageImageList,
    sentAt
  }
}
