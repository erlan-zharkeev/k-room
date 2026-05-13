import {
  normalizeTimestamp,
  type IEventCreateRoom,
  type IEventDeleteContact,
  type IEventRoomCreated,
  type IEventSaveContact,
  type IEventUpdateInteraction,
  type InteractionType,
  type SocketActionsType
} from 'global-shared'
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useSettings } from 'src/entities/setting'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { socket } from 'src/shared/api'
import { formatLocalizedRelativeTime, useI18n, type DbContactType } from 'src/shared/lib'

import { CONTACTS_PAGE_I18N } from '../config/i18n'

export const useContactsPage = () => {
  const router = useRouter()
  const { getPersonalByContactId } = useChatRoom()
  const { settings } = useSettings()
  const { t } = useI18n()

  const contactToDeleteId = ref('')
  const isDeleteDialogOpen = ref(false)
  const loadingContactIds = reactive(new Set<string>())
  const creatingChatContactIds = reactive(new Set<string>())

  const getContactActivity = ({ interactionType, lastSeen, online }: DbContactType) => {
    if (interactionType !== 'invite-accepted') return ''
    if (online) return t(CONTACTS_PAGE_I18N.online)

    const normalized = normalizeTimestamp(lastSeen)

    if (!normalized) return t(CONTACTS_PAGE_I18N.lastSeenRecently)

    return `${t(CONTACTS_PAGE_I18N.lastSeen)} ${formatLocalizedRelativeTime(
      normalized,
      settings.value.localization.language
    )}`
  }

  const getContactStatus = ({ interactionType }: DbContactType) => {
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

    const payload: IEventSaveContact = { interlocutorId }

    loadingContactIds.add(interlocutorId)
    socket.emit<SocketActionsType>('save-contact', payload)
    socket.once<SocketActionsType>('contact-add-success', () => {
      loadingContactIds.delete(interlocutorId)
    })
  }

  const updateInteraction = (contactId: string, interaction: InteractionType) => {
    if (loadingContactIds.has(contactId)) return

    const payload: IEventUpdateInteraction = { contactId, interaction }

    loadingContactIds.add(contactId)
    socket.emit<SocketActionsType>('update-contact-interaction-type', payload)
    socket.once<SocketActionsType>('contact-interaction-updated', () => {
      loadingContactIds.delete(contactId)
    })
  }

  const goToChatRoom = (roomId?: string) => {
    if (!roomId) return

    router.push(`${APP_PAGE_ROUTES.chatRooms}/${roomId}`)
  }

  const createPrivateChat = (contactId: string) => {
    if (creatingChatContactIds.has(contactId)) return

    const payload: IEventCreateRoom = { contactIds: [contactId] }

    creatingChatContactIds.add(contactId)
    socket.emit<SocketActionsType>('create-chat-room', payload)
    socket.once<SocketActionsType>('room-created', ({ roomId }: IEventRoomCreated) => {
      creatingChatContactIds.delete(contactId)
      goToChatRoom(roomId)
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
    const payload: IEventDeleteContact = { deletingUserId }

    loadingContactIds.add(deletingUserId)
    socket.emit<SocketActionsType>('delete-contact', payload)
    socket.once<SocketActionsType>('contact-delete-success', () => {
      loadingContactIds.delete(deletingUserId)
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
