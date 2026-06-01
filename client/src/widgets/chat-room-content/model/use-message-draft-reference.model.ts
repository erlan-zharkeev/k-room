import type { ChatRoom, Message } from 'global-shared'
import { computed, type Ref, ref } from 'vue'

import { useI18n } from 'src/shared/lib'

import { MESSAGE_DRAFT_REFERENCE_KIND } from '../config/constants'
import { CHAT_ROOM_CONTENT_I18N } from '../config/i18n'
import type { MessageDraftReferenceKind, MessageDraftReferenceState } from '../config/types'
import { buildRepliedMessage, cloneRepliedMessage } from '../lib/build-replied-message'
import { resolveMessagePreviewText } from '../lib/resolve-message-preview-text'

const messageDraftReferenceState = ref<MessageDraftReferenceState | null>(null)

export const useMessageDraftReference = (room?: Ref<ChatRoom>) => {
  const { t } = useI18n()
  const messageDraftReference = computed(() => messageDraftReferenceState.value?.message ?? null)
  const messageDraftReferenceKind = computed(() => messageDraftReferenceState.value?.kind ?? null)
  const messageDraftReferenceId = computed(() => messageDraftReference.value?.id ?? '')
  const isMessageDraftReferenceActive = computed(() => Boolean(messageDraftReferenceState.value))
  const isMessageDraftReferenceCurrentRoom = computed(() => {
    const state = messageDraftReferenceState.value

    if (!state || !room) return false

    return state.roomId === room.value.id
  })
  const messageDraftReferenceTitle = computed(() => {
    const kind = messageDraftReferenceKind.value

    if (!kind) return ''

    const isForwardReference = kind === MESSAGE_DRAFT_REFERENCE_KIND.FORWARD

    return t(isForwardReference ? CHAT_ROOM_CONTENT_I18N.forwardMessage : CHAT_ROOM_CONTENT_I18N.replyMessage)
  })
  const messageDraftReferencePreviewText = computed(() =>
    messageDraftReference.value ? resolveMessagePreviewText(messageDraftReference.value) : ''
  )

  const startMessageDraftReference = (message: Message, roomId: string, kind: MessageDraftReferenceKind) => {
    messageDraftReferenceState.value = {
      roomId,
      kind,
      message: buildRepliedMessage(message, kind, roomId)
    }
  }

  const startMessageReply = (message: Message, roomId: string) => {
    startMessageDraftReference(message, roomId, MESSAGE_DRAFT_REFERENCE_KIND.REPLY)
  }

  const startMessageForward = (message: Message, roomId: string) => {
    startMessageDraftReference(message, roomId, MESSAGE_DRAFT_REFERENCE_KIND.FORWARD)
  }

  const cancelMessageDraftReference = () => {
    messageDraftReferenceState.value = null
  }

  const buildMessageDraftReferencePayload = (roomId: string) => {
    const state = messageDraftReferenceState.value
    if (!state || state.roomId !== roomId) return null
    return cloneRepliedMessage(state.message)
  }

  return {
    messageDraftReference,
    messageDraftReferenceKind,
    messageDraftReferenceId,
    isMessageDraftReferenceActive,
    isMessageDraftReferenceCurrentRoom,
    messageDraftReferencePreviewText,
    messageDraftReferenceTitle,
    startMessageReply,
    startMessageForward,
    cancelMessageDraftReference,
    buildMessageDraftReferencePayload
  }
}
