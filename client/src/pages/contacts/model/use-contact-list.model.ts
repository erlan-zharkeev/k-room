import type { InteractionType } from 'global-shared'

import type { DbContactType } from 'src/shared/lib'

import type { ContactListEmitType, IContactListProps } from '../config/types'
import { getContactAvatarId } from '../lib/get-contact-avatar-id'

export const useContactList = (props: IContactListProps, emit: ContactListEmitType) => {
  const getContactStatusTagColor = ({ interactionType }: DbContactType) => {
    if (interactionType === 'blocked') return 'var(--nmorph-warn-color)'
    if (interactionType === 'invited' || interactionType === 'invite-received') return 'var(--nmorph-accent-color)'

    return 'var(--nmorph-semi-contrast-text-color)'
  }
  const getContactActivityTagColor = ({ online }: DbContactType) =>
    online ? 'var(--nmorph-success-color)' : 'var(--nmorph-semi-contrast-text-color)'
  const inviteContact = (id: string) => {
    emit('updateInteraction', id, 'invited')
  }
  const deleteContact = (id: string) => {
    emit('delete', id)
  }
  const updateContactInteraction = (id: string, interaction: InteractionType) => {
    emit('updateInteraction', id, interaction)
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
    getContactAvatarId,
    getContactStatusTagColor,
    getContactActivityTagColor,
    inviteContact,
    deleteContact,
    updateContactInteraction,
    hasContactChatRoom,
    goToContactChat,
    createContactChat
  }
}
