import {
  isAcceptedContactInteraction,
  isBlockedContactInteraction,
  isDefaultContactInteraction,
  isInviteReceivedContactInteraction
} from 'global-shared'
import { computed, ref } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type {
  ContactContextMenuAction,
  ContactContextMenuEmitFn,
  ContactContextMenuOption,
  ContactContextMenuProps
} from '../config/types'
import ContactContextMenuActionItem from '../ui/ContactContextMenuActionItem.vue'

export const useContactContextMenu = (props: ContactContextMenuProps, emit: ContactContextMenuEmitFn) => {
  const { t } = useI18n()
  const isContextMenuOpen = ref(false)
  const showContactActionBadge = computed(() => isInviteReceivedContactInteraction(props.contact.interactionType))

  const setContextMenuOpen = (value: boolean) => {
    isContextMenuOpen.value = value
  }

  const closeContextMenu = () => {
    setContextMenuOpen(false)
  }

  const updateContactInteraction = (id: string, interaction: typeof props.contact.interactionType) => {
    emit('update-interaction', id, interaction)
  }

  const goToChat = (id?: string) => {
    emit('go-to-chat', id)
  }

  const createChat = (id: string) => {
    emit('create-chat', id)
  }

  const deleteContact = (id: string) => {
    emit('delete', id)
  }

  const buildContactContextMenuActionOption = (
    action: ContactContextMenuAction,
    label: string,
    option: Pick<ContactContextMenuOption, 'color' | 'disabled'> = {}
  ): ContactContextMenuOption => ({
    value: action,
    component: ContactContextMenuActionItem,
    componentProps: {
      action,
      label,
      contactId: props.contact.id,
      personalChatRoomId: props.personalChatRoomId,
      updateInteraction: updateContactInteraction,
      goToChat,
      createChat,
      deleteContact,
      onSelect: closeContextMenu,
      ...option
    },
    closeOnClick: false
  })

  const contextMenuOptions = computed<ContactContextMenuOption[]>(() => {
    const options: ContactContextMenuOption[] = []
    const { interactionType } = props.contact

    if (isDefaultContactInteraction(interactionType)) {
      options.push(
        buildContactContextMenuActionOption('invite', t(CONTACTS_PAGE_I18N.invite), {
          disabled: props.isUpdatingContact
        })
      )
    }

    if (isAcceptedContactInteraction(interactionType)) {
      if (props.personalChatRoomId) {
        options.push(buildContactContextMenuActionOption('go-to-chat', t(CONTACTS_PAGE_I18N.write)))
      } else {
        options.push(
          buildContactContextMenuActionOption('create-chat', t(CONTACTS_PAGE_I18N.createChat), {
            disabled: props.isCreatingChat
          })
        )
      }
    }

    if (isInviteReceivedContactInteraction(interactionType)) {
      options.push(buildContactContextMenuActionOption('accept', t(CONTACTS_PAGE_I18N.accept)))
    }

    options.push(
      isBlockedContactInteraction(interactionType)
        ? buildContactContextMenuActionOption('unblock', t(CONTACTS_PAGE_I18N.unblock))
        : buildContactContextMenuActionOption('block', t(CONTACTS_PAGE_I18N.block))
    )

    options.push(buildContactContextMenuActionOption('delete', t(CONTACTS_PAGE_I18N.delete), { color: 'error' }))

    return options
  })

  return {
    isContextMenuOpen,
    showContactActionBadge,
    contextMenuOptions,
    setContextMenuOpen
  }
}
