import { computed, ref } from 'vue'

import type { MessageRecord } from 'src/shared/lib'

import { MESSAGE_DRAFT_REFERENCE_KIND } from '../config/constants'
import type { MessageDraftReferenceKind, MessageDraftReferenceState } from '../config/types'
import { buildRepliedMessage, cloneRepliedMessage } from '../lib/build-replied-message'

const messageDraftReferenceState = ref<MessageDraftReferenceState | null>(null)

export const useMessageDraftReference = () => {
  const messageDraftReference = computed(() => messageDraftReferenceState.value?.message ?? null)
  const messageDraftReferenceKind = computed(() => messageDraftReferenceState.value?.kind ?? null)
  const isMessageDraftReferenceActive = computed(() => Boolean(messageDraftReferenceState.value))

  const startMessageDraftReference = (message: MessageRecord, roomId: string, kind: MessageDraftReferenceKind) => {
    messageDraftReferenceState.value = {
      roomId,
      kind,
      message: buildRepliedMessage(message, kind)
    }
  }

  const startMessageReply = (message: MessageRecord, roomId: string) => {
    startMessageDraftReference(message, roomId, MESSAGE_DRAFT_REFERENCE_KIND.REPLY)
  }

  const startMessageForward = (message: MessageRecord, roomId: string) => {
    startMessageDraftReference(message, roomId, MESSAGE_DRAFT_REFERENCE_KIND.FORWARD)
  }

  const cancelMessageDraftReference = () => {
    messageDraftReferenceState.value = null
  }

  const isMessageDraftReferenceRoom = (roomId: string) => messageDraftReferenceState.value?.roomId === roomId

  const buildMessageDraftReferencePayload = (roomId: string) => {
    const state = messageDraftReferenceState.value
    if (!state || state.roomId !== roomId) return null
    return cloneRepliedMessage(state.message)
  }

  return {
    messageDraftReference,
    messageDraftReferenceKind,
    isMessageDraftReferenceActive,
    startMessageReply,
    startMessageForward,
    cancelMessageDraftReference,
    isMessageDraftReferenceRoom,
    buildMessageDraftReferencePayload
  }
}
