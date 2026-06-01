import { computed, toRef, watch } from 'vue'

import { useSyncMedia } from 'src/entities/media-file'
import { useLocalizedDateTime } from 'src/entities/setting'

import type { MessageBodyProps } from '../config/types'

import { useMessageEdit } from './use-message-edit.model'

export const useMessageBody = (props: MessageBodyProps) => {
  const message = toRef(props, 'message')
  const { formatTime } = useLocalizedDateTime()
  const { sync } = useSyncMedia()
  const { isEditingMessage } = useMessageEdit()

  const showAuthorNickname = computed(() => !props.isPrivateRoom && !message.value.isSelf)
  const isMessageEditing = computed(() => isEditingMessage(props.room.id, message.value.id))
  const hasMessageBody = computed(() => Boolean(message.value.body.trim()))
  const messageImages = computed(() => message.value.images ?? [])
  const messageDocuments = computed(() => message.value.documents ?? [])
  const messageAudios = computed(() => message.value.audios ?? [])
  const messageVideos = computed(() => message.value.videos ?? [])
  const resolveMessageImageIds = () => messageImages.value.map(({ src }) => src)
  const resolveMessageDocumentIds = () => messageDocuments.value.map(({ src }) => src)
  const resolveMessageAudioIds = () => messageAudios.value.map(({ src }) => src)
  const resolveMessageVideoIds = () => messageVideos.value.map(({ src }) => src)
  const resolveMessageMediaIds = () => [
    ...resolveMessageImageIds(),
    ...resolveMessageDocumentIds(),
    ...resolveMessageAudioIds(),
    ...resolveMessageVideoIds()
  ]
  watch(
    resolveMessageMediaIds,
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
    isMessageEditing,
    hasMessageBody,
    messageAudios,
    messageDocuments,
    messageImages,
    messageVideos,
    sentAt
  }
}
