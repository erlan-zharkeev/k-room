<script setup lang="ts">
import { NmorphBadge, NmorphButton, NmorphContextMenu, NmorphIconMore } from '@nmorph/nmorph-ui-kit'
import { isUnknownObject } from 'global-shared'
import { computed } from 'vue'

import { useI18n } from 'src/shared/lib'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { IContactContextMenuEmits, IContactContextMenuProps } from '../config/types'

const props = defineProps<IContactContextMenuProps>()
const emit = defineEmits<IContactContextMenuEmits>()
const { t } = useI18n()
const contactActionBadgeValue = computed(() => (props.contact.interactionType === 'invite-received' ? '!' : undefined))
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
</script>

<template>
  <NmorphContextMenu
    class="contact-context-menu"
    trigger="click"
    :options="contextMenuOptions"
    :aria-label="$t(CONTACTS_PAGE_I18N.contactActions)"
    @select="selectContactAction"
  >
    <NmorphBadge :value="contactActionBadgeValue" color="var(--nmorph-warn-color)" size="tiny" :offset-x="-2">
      <NmorphButton shape="square" :aria-label="$t(CONTACTS_PAGE_I18N.contactActions)">
        <template #icon>
          <NmorphIconMore />
        </template>
      </NmorphButton>
    </NmorphBadge>
  </NmorphContextMenu>
</template>
