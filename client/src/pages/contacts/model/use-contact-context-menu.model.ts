import { isUnknownObject } from 'global-shared'
import { computed } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { ContactContextMenuEmitType, IContactContextMenuProps } from '../config/types'

export const useContactContextMenu = (props: IContactContextMenuProps, emit: ContactContextMenuEmitType) => {
  const { t } = useI18n()

  const contactActionBadgeValue = computed(() =>
    props.contact.interactionType === 'invite-received' ? '!' : undefined
  )

  const contextMenuOptions = computed(() => {
    const options = []
    const { interactionType } = props.contact

    if (interactionType === 'invite-received') {
      options.push({
        label: t(CONTACTS_PAGE_I18N.accept),
        value: 'accept'
      })
    }

    options.push(
      interactionType === 'blocked'
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

  const selectContactAction = (option: unknown) => {
    if (!isUnknownObject(option)) return

    const { id } = props.contact

    switch (option.value) {
      case 'accept':
        emit('updateInteraction', id, 'invite-accepted')
        break
      case 'block':
        emit('updateInteraction', id, 'blocked')
        break
      case 'unblock':
        emit('updateInteraction', id, 'default')
        break
      case 'delete':
        emit('delete', id)
        break
    }
  }

  return {
    contactActionBadgeValue,
    contextMenuOptions,
    selectContactAction
  }
}
