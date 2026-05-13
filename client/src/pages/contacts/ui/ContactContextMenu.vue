<script setup lang="ts">
import { NmorphBadge, NmorphCheckbox, NmorphContextMenu, NmorphIcon, NmorphIconMore } from '@nmorph/nmorph-ui-kit'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { IContactContextMenuEmits, IContactContextMenuProps } from '../config/types'
import { useContactContextMenu } from '../model/use-contact-context-menu.model'

const props = defineProps<IContactContextMenuProps>()
const emit = defineEmits<IContactContextMenuEmits>()
const { isContextMenuOpen, contactActionBadgeValue, contextMenuOptions, setContextMenuOpen, selectContactAction } =
  useContactContextMenu(props, emit)
</script>

<template>
  <NmorphContextMenu
    :model-value="isContextMenuOpen"
    class="contact-context-menu"
    trigger="click"
    :options="contextMenuOptions"
    :aria-label="$t(CONTACTS_PAGE_I18N.contactActions)"
    @update:model-value="setContextMenuOpen"
    @select="selectContactAction"
  >
    <NmorphBadge :value="contactActionBadgeValue" color="var(--nmorph-warn-color)" size="tiny" :offset-x="-2">
      <NmorphCheckbox
        class="contact-context-menu__trigger"
        design="button"
        height="basic"
        :model-value="isContextMenuOpen"
        :aria-label="$t(CONTACTS_PAGE_I18N.contactActions)"
      >
        <template #label>
          <NmorphIcon>
            <NmorphIconMore />
          </NmorphIcon>
        </template>
      </NmorphCheckbox>
    </NmorphBadge>
  </NmorphContextMenu>
</template>
