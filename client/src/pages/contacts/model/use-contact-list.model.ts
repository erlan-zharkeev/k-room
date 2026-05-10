import { reactive, ref } from 'vue'

import type { ContactListEmitType, IContactListProps } from '../config/types'
import { getContactAvatarId } from '../lib/get-contact-avatar-id'

export const useContactList = (props: IContactListProps, emit: ContactListEmitType) => {
  const openedContactMenuId = ref('')
  const contactMenuButtonElements = reactive(new Map<string, HTMLElement>())

  const setContactMenuButtonRef = (id: string, element: unknown) => {
    if (element instanceof HTMLElement) {
      contactMenuButtonElements.set(id, element)
      return
    }

    contactMenuButtonElements.delete(id)
  }
  const getContactMenuRelativeElement = (id: string) => contactMenuButtonElements.get(id) ?? null
  const closeContactMenu = () => {
    openedContactMenuId.value = ''
  }
  const toggleContactMenu = (id: string) => {
    openedContactMenuId.value = openedContactMenuId.value === id ? '' : id
  }
  const inviteContact = (id: string) => {
    emit('updateInteraction', id, 'invited')
  }
  const acceptContactInvite = (id: string) => {
    emit('updateInteraction', id, 'invite-accepted')
  }
  const declineContactInvite = (id: string) => {
    emit('updateInteraction', id, 'default')
  }
  const deleteContact = (id: string) => {
    closeContactMenu()
    emit('delete', id)
  }
  const blockContact = (id: string) => {
    closeContactMenu()
    emit('updateInteraction', id, 'blocked')
  }
  const unblockContact = (id: string) => {
    closeContactMenu()
    emit('updateInteraction', id, 'default')
  }
  const hasContactChatRoom = (id: string) => Boolean(props.getPersonalChatRoomId(id))
  const goToContactChat = (id: string) => {
    const roomId = props.getPersonalChatRoomId(id)

    if (!roomId) return

    emit('goToChat', roomId)
  }
  const createContactChat = (id: string) => {
    emit('createChat', id)
  }

  return {
    openedContactMenuId,
    getContactAvatarId,
    setContactMenuButtonRef,
    getContactMenuRelativeElement,
    closeContactMenu,
    toggleContactMenu,
    inviteContact,
    acceptContactInvite,
    declineContactInvite,
    deleteContact,
    blockContact,
    unblockContact,
    hasContactChatRoom,
    goToContactChat,
    createContactChat
  }
}
