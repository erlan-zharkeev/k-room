import { computed, toRef, watch } from 'vue'

import { useSyncMedia } from 'src/entities/media-file'
import { useLocalizedDateTime } from 'src/entities/setting'
import { useI18n, useLiveMediaUrls } from 'src/shared/lib'

import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageBodyProps, MessageBodySelectMessage } from '../config/types'

import { useMessageEdit } from './use-message-edit.model'

export const useMessageBody = (props: MessageBodyProps, onSelectMessage: MessageBodySelectMessage) => {
  const message = toRef(props, 'message')
  const { t } = useI18n()
  const { formatTime } = useLocalizedDateTime()
  const { sync } = useSyncMedia()
  const { isEditingMessage } = useMessageEdit()

  const showAuthorNickname = computed(() => !props.isPrivateRoom && !message.value.isSelf)
  const isMessageEditing = computed(() => isEditingMessage(props.room.id, message.value.id))
  const hasMessageBody = computed(() => Boolean(message.value.body.trim()))
  const repliedMessage = computed(() => message.value.repliedMessage)
  const repliedMessagePreviewTitle = computed(() => {
    const reference = repliedMessage.value

    if (!reference) return ''

    const titleSource = reference.forward ? CHAT_ROOM_CONTENT_I18N.forwardMessage : CHAT_ROOM_CONTENT_I18N.replyMessage
    const actionTitle = t(titleSource)

    return `${actionTitle}: ${reference.authorNickname}`
  })
  const repliedMessagePreviewText = computed(() => {
    const reference = repliedMessage.value

    if (!reference) return ''

    const hasBody = Boolean(reference.body.trim())
    const firstImage = reference.images?.[0]

    if (hasBody) return reference.body
    if (firstImage) return firstImage.name

    return ''
  })
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

  const selectRepliedMessage = () => {
    const reference = repliedMessage.value

    if (!reference) return

    onSelectMessage(reference.id)
  }

  return {
    showAuthorNickname,
    isMessageEditing,
    hasMessageBody,
    repliedMessage,
    repliedMessagePreviewText,
    repliedMessagePreviewTitle,
    messageImagePreviewUrlList,
    selectRepliedMessage,
    sentAt
  }
}
