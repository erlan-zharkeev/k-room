import { CONTACT_INTERACTION } from 'global-shared'

import type { ContactContextMenuActionItemEmitFn, ContactContextMenuActionItemProps } from '../config/types'

export const useContactContextMenuActionItem = (
  props: ContactContextMenuActionItemProps,
  emit: ContactContextMenuActionItemEmitFn
) => {
  const selectContactContextMenuAction = () => {
    if (props.disabled) return

    switch (props.action) {
      case 'invite':
        props.updateInteraction(props.contactId, CONTACT_INTERACTION.INVITED)
        break
      case 'go-to-chat':
        props.goToChat(props.personalChatRoomId)
        break
      case 'create-chat':
        props.createChat(props.contactId)
        break
      case 'accept':
        props.updateInteraction(props.contactId, CONTACT_INTERACTION.INVITE_ACCEPTED)
        break
      case 'block':
        props.updateInteraction(props.contactId, CONTACT_INTERACTION.BLOCKED)
        break
      case 'unblock':
        props.updateInteraction(props.contactId, CONTACT_INTERACTION.DEFAULT)
        break
      case 'delete':
        props.deleteContact(props.contactId)
        break
    }

    emit('select')
  }

  return {
    selectContactContextMenuAction
  }
}
