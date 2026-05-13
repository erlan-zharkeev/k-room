import { isUnknownObject } from 'global-shared'
import { computed, ref } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { IContactContextMenuEmitFn, IContactContextMenuOption, IContactContextMenuProps } from '../config/types'

export const useContactContextMenu = (props: IContactContextMenuProps, emit: IContactContextMenuEmitFn) => {
  const { t } = useI18n()
  const isContextMenuOpen = ref(false)
  const contactActionBadgeValue = computed(() =>
    props.contact.interactionType === 'invite-received' ? '!' : undefined
  )
  const contextMenuOptions = computed<IContactContextMenuOption[]>(() => {
    const options: IContactContextMenuOption[] = []
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

  const setContextMenuOpen = (value: boolean) => {
    isContextMenuOpen.value = value
  }

  const selectContactAction = (option: unknown) => {
    if (!isUnknownObject(option)) return

    const { id } = props.contact

    switch (option.value) {
      case 'accept':
        emit('update-interaction', id, 'invite-accepted')
        break
      case 'block':
        emit('update-interaction', id, 'blocked')
        break
      case 'unblock':
        emit('update-interaction', id, 'default')
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
