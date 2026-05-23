import {
  type CreateRoomAckPayload,
  normalizeTimestamp,
  type EventCreateRoom,
  type EventDeleteContact,
  type EventSaveContact,
  type EventUpdateInteraction,
  type Interaction,
  isAcceptedContactInteraction,
  isBlockedContactInteraction,
  isInvitedContactInteraction,
  isInviteReceivedContactInteraction
} from 'global-shared'
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useLocalizedDateTime } from 'src/entities/setting'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { useSocketAction } from 'src/shared/api'
import { useI18n, type ContactRecord } from 'src/shared/lib'

import { CONTACTS_PAGE_I18N } from '../config/i18n'

export const useContactsPage = () => {
  const router = useRouter()
  const { getPersonalByContactId } = useChatRoom()
  const { formatRelativeTime } = useLocalizedDateTime()
  const { t } = useI18n()
  const { emitSocketAction } = useSocketAction()

  const contactToDeleteId = ref('')
  const isDeleteDialogOpen = ref(false)
  const loadingContactIds = reactive(new Set<string>())
  const creatingChatContactIds = reactive(new Set<string>())

  const getContactActivity = ({ interactionType, lastSeen, online }: ContactRecord) => {
    if (!isAcceptedContactInteraction(interactionType)) return ''
    if (online) return t(CONTACTS_PAGE_I18N.online)

    const normalized = normalizeTimestamp(lastSeen)

    if (!normalized) return t(CONTACTS_PAGE_I18N.lastSeenRecently)

    return `${t(CONTACTS_PAGE_I18N.lastSeen)} ${formatRelativeTime(normalized)}`
  }

  const getContactStatus = ({ interactionType }: ContactRecord) => {
    if (isBlockedContactInteraction(interactionType)) return t(CONTACTS_PAGE_I18N.blocked)
    if (isInvitedContactInteraction(interactionType)) return t(CONTACTS_PAGE_I18N.invited)
    if (isInviteReceivedContactInteraction(interactionType)) return t(CONTACTS_PAGE_I18N.inviteReceived)

    return ''
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

    loadingContactIds.add(contactId)
    void emitSocketAction<EventUpdateInteraction>('update-contact-interaction-type', payload, {
      onSettled: () => {
        loadingContactIds.delete(contactId)
      }
    })
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
