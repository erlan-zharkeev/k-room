import {
  type ContactInteractionUpdateFailedReason,
  type CreateRoomAckPayload,
  normalizeTimestamp,
  type EventCreateRoom,
  type EventDeleteContact,
  type EventSaveContact,
  type EventUpdateInteraction,
  type Interaction
} from 'global-shared'
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useLocalizedDateTime } from 'src/entities/setting'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { useSocketAction } from 'src/shared/api'
import { TOAST_I18N, useAppToast, useI18n, type ContactRecord } from 'src/shared/lib'

import { CONTACT_INTERACTION_UPDATE_FAILED_MESSAGE_BY_REASON } from '../config/constants'
import { CONTACTS_PAGE_I18N } from '../config/i18n'

export const useContactsPage = () => {
  const router = useRouter()
  const { getPersonalByContactId } = useChatRoom()
  const { formatRelativeTime } = useLocalizedDateTime()
  const { t } = useI18n()
  const toast = useAppToast()
  const { emitSocketAction } = useSocketAction()

  const contactToDeleteId = ref('')
  const isDeleteDialogOpen = ref(false)
  const loadingContactIds = reactive(new Set<string>())
  const creatingChatContactIds = reactive(new Set<string>())

  const getContactActivity = ({ interactionType, lastSeen, online }: ContactRecord) => {
    if (interactionType !== 'invite-accepted') return ''
    if (online) return t(CONTACTS_PAGE_I18N.online)

    const normalized = normalizeTimestamp(lastSeen)

    if (!normalized) return t(CONTACTS_PAGE_I18N.lastSeenRecently)

    return `${t(CONTACTS_PAGE_I18N.lastSeen)} ${formatRelativeTime(normalized)}`
  }

  const getContactStatus = ({ interactionType }: ContactRecord) => {
    switch (interactionType) {
      case 'blocked':
        return t(CONTACTS_PAGE_I18N.blocked)
      case 'invited':
        return t(CONTACTS_PAGE_I18N.invited)
      case 'invite-received':
        return t(CONTACTS_PAGE_I18N.inviteReceived)
      default:
        return ''
    }
  }

  const getPersonalChatRoomId = (id: string) => getPersonalByContactId(id)?.id

  const addContact = (interlocutorId: string) => {
    if (loadingContactIds.has(interlocutorId)) return

    const payload: EventSaveContact = { interlocutorId }

    loadingContactIds.add(interlocutorId)
    void emitSocketAction<EventSaveContact>('save-contact', payload, {
      onSettled: () => {
        loadingContactIds.delete(interlocutorId)
      }
    })
  }

  const updateInteraction = (contactId: string, interaction: Interaction) => {
    if (loadingContactIds.has(contactId)) return

    const payload: EventUpdateInteraction = { contactId, interaction }

    function showInteractionUpdateFailure(reason?: ContactInteractionUpdateFailedReason) {
      if (!reason) return

      toast.add({
        type: 'warning',
        title: t(TOAST_I18N.warn),
        content: t(CONTACT_INTERACTION_UPDATE_FAILED_MESSAGE_BY_REASON[reason])
      })
    }

    loadingContactIds.add(contactId)
    void emitSocketAction<EventUpdateInteraction, void, ContactInteractionUpdateFailedReason>(
      'update-contact-interaction-type',
      payload,
      {
        onFailure: ({ handledByGlobalError, reason }) => {
          if (handledByGlobalError) return

          showInteractionUpdateFailure(reason)
        },
        onSettled: () => {
          loadingContactIds.delete(contactId)
        }
      }
    )
  }

  const goToChatRoom = (roomId?: string) => {
    if (!roomId) return

    router.push(`${APP_PAGE_ROUTES.chatRooms}/${roomId}`)
  }

  const createPrivateChat = (contactId: string) => {
    if (creatingChatContactIds.has(contactId)) return

    const payload: EventCreateRoom = { contactIds: [contactId] }

    creatingChatContactIds.add(contactId)
    void emitSocketAction<EventCreateRoom, CreateRoomAckPayload>('create-chat-room', payload, {
      onSuccess: ({ payload: responsePayload }) => {
        goToChatRoom(responsePayload?.roomId)
      },
      onSettled: () => {
        creatingChatContactIds.delete(contactId)
      }
    })
  }

  const openDeleteDialog = (contactId: string) => {
    contactToDeleteId.value = contactId
    isDeleteDialogOpen.value = true
  }

  const closeDeleteDialog = () => {
    contactToDeleteId.value = ''
    isDeleteDialogOpen.value = false
  }

  const deleteContact = () => {
    if (!contactToDeleteId.value) return

    const deletingUserId = contactToDeleteId.value
    const payload: EventDeleteContact = { deletingUserId }

    loadingContactIds.add(deletingUserId)
    void emitSocketAction<EventDeleteContact>('delete-contact', payload, {
      onSettled: () => {
        loadingContactIds.delete(deletingUserId)
      }
    })
    closeDeleteDialog()
  }

  watch(isDeleteDialogOpen, (value) => {
    if (!value) {
      contactToDeleteId.value = ''
    }
  })

  return {
    loadingContactIds,
    creatingChatContactIds,
    isDeleteDialogOpen,
    getContactActivity,
    getContactStatus,
    getPersonalChatRoomId,
    addContact,
    updateInteraction,
    goToChatRoom,
    createPrivateChat,
    openDeleteDialog,
    closeDeleteDialog,
    deleteContact
  }
}
