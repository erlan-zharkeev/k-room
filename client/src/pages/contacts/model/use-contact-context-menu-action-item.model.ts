import type { ContactContextMenuActionItemEmitFn, ContactContextMenuActionItemProps } from '../config/types'

export const useContactContextMenuActionItem = (
  props: ContactContextMenuActionItemProps,
  emit: ContactContextMenuActionItemEmitFn
) => {
  const selectContactContextMenuAction = () => {
    if (props.disabled) return

    switch (props.action) {
      case 'invite':
        props.updateInteraction(props.contactId, 'invited')
        break
      case 'go-to-chat':
        props.goToChat(props.personalChatRoomId)
        break
      case 'create-chat':
        props.createChat(props.contactId)
        break
      case 'accept':
        props.updateInteraction(props.contactId, 'invite-accepted')
        break
      case 'block':
        props.updateInteraction(props.contactId, 'blocked')
        break
      case 'unblock':
        props.updateInteraction(props.contactId, 'default')
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
