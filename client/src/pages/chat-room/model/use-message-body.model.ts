import { computed, toRef } from 'vue'

import { useLocalizedDateTime } from 'src/entities/setting'

import type { IMessageBodyProps } from '../config/types'
import { resolveMessageImageSrc } from '../lib/resolve-message-image-src'

export const useMessageBody = (props: IMessageBodyProps) => {
  const message = toRef(props, 'message')
  const { formatTime } = useLocalizedDateTime()

  const showAuthorNickname = computed(() => !props.isPrivateRoom && !message.value.isSelf)
  const messageImageList = computed(() =>
    (message.value.images ?? []).map((image) => ({
      ...image,
      previewSrc: resolveMessageImageSrc(image.src)
    }))
  )

  const sentAt = computed(() => {
    if (!message.value.createdAt) return ''
    return formatTime(message.value.createdAt)
  })

  const reactionList = computed(() => {
    const reactionMap = new Map<string, { glyphKey: string; nicknames: string[] }>()
    message.value.reactions?.forEach((reaction) => {
      const current = reactionMap.get(reaction.glyphKey) ?? { glyphKey: reaction.glyphKey, nicknames: [] }
      if (!current.nicknames.includes(reaction.nickname)) {
        current.nicknames.push(reaction.nickname)
      }
      reactionMap.set(reaction.glyphKey, current)
    })
    return [...reactionMap.values()]
  })

  return {
    showAuthorNickname,
    messageImageList,
    sentAt,
    reactionList
  }
}
