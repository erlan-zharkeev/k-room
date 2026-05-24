import {
  CONTACT_INTERACTION,
  isAcceptedContactInteraction,
  isBlockedContactInteraction,
  isDefaultContactInteraction,
  isInviteReceivedContactInteraction,
  isUnknownObject
} from 'global-shared'
import { computed, ref } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { ContactContextMenuEmitFn, ContactContextMenuOption, ContactContextMenuProps } from '../config/types'

export const useContactContextMenu = (props: ContactContextMenuProps, emit: ContactContextMenuEmitFn) => {
  const { t } = useI18n()
  const isContextMenuOpen = ref(false)
  const showContactActionBadge = computed(() => isInviteReceivedContactInteraction(props.contact.interactionType))
  const contextMenuOptions = computed<ContactContextMenuOption[]>(() => {
    const options: ContactContextMenuOption[] = []
    const { interactionType } = props.contact

    if (isDefaultContactInteraction(interactionType)) {
      options.push({
        label: t(CONTACTS_PAGE_I18N.invite),
        value: 'invite',
        disabled: props.isUpdatingContact
      })
    }

    if (isAcceptedContactInteraction(interactionType)) {
      if (props.personalChatRoomId) {
        options.push({
          label: t(CONTACTS_PAGE_I18N.write),
          value: 'go-to-chat'
        })
      } else {
        options.push({
          label: t(CONTACTS_PAGE_I18N.createChat),
          value: 'create-chat',
          disabled: props.isCreatingChat
        })
      }
    }

    if (isInviteReceivedContactInteraction(interactionType)) {
      options.push({
        label: t(CONTACTS_PAGE_I18N.accept),
        value: 'accept'
      })
    }

    options.push(
      isBlockedContactInteraction(interactionType)
        ? {
            label: t(CONTACTS_PAGE_I18N.unblock),
            value: 'unblock'
          }
        : {
            label: t(CONTACTS_PAGE_I18N.block),
            value: 'block'
          }
    )

    options.push({
      label: t(CONTACTS_PAGE_I18N.delete),
      value: 'delete',
      color: 'var(--nmorph-error-text-color)'
    })

    return options
  })

  const setContextMenuOpen = (value: boolean) => {
    isContextMenuOpen.value = value
  }

  const selectContactAction = (option: unknown) => {
    if (!isUnknownObject(option)) return

    const { id } = props.contact

    switch (option.value) {
      case 'invite':
        emit('update-interaction', id, CONTACT_INTERACTION.INVITED)
        break
      case 'go-to-chat':
        emit('go-to-chat', props.personalChatRoomId)
        break
      case 'create-chat':
        emit('create-chat', id)
        break
      case 'accept':
        emit('update-interaction', id, CONTACT_INTERACTION.INVITE_ACCEPTED)
        break
      case 'block':
        emit('update-interaction', id, CONTACT_INTERACTION.BLOCKED)
        break
      case 'unblock':
        emit('update-interaction', id, CONTACT_INTERACTION.DEFAULT)
        break
      case 'delete':
        emit('delete', id)
        break
    }
  }

  return {
    isContextMenuOpen,
    showContactActionBadge,
    contextMenuOptions,
    setContextMenuOpen,
    selectContactAction
  }
}
