import {
  CONTACT_INTERACTION,
  isBlockedContactInteraction,
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
  const contactActionBadgeValue = computed(() =>
    isInviteReceivedContactInteraction(props.contact.interactionType) ? '!' : undefined
  )
  const contextMenuOptions = computed<ContactContextMenuOption[]>(() => {
    const options: ContactContextMenuOption[] = []
    const { interactionType } = props.contact

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
    contactActionBadgeValue,
    contextMenuOptions,
    setContextMenuOpen,
    selectContactAction
  }
}
