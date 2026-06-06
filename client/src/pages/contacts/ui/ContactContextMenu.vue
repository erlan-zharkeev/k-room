<script setup lang="ts">
import { NmorphBadge, NmorphButton, NmorphContextMenu, NmorphIcon, NmorphIconBurger } from '@nmorph/nmorph-ui-kit'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { ContactContextMenuEmits, ContactContextMenuProps } from '../config/types'
import { useContactContextMenu } from '../model/use-contact-context-menu.model'

const props = defineProps<ContactContextMenuProps>()
const emit = defineEmits<ContactContextMenuEmits>()
const { isContextMenuOpen, showContactActionBadge, contextMenuOptions, setContextMenuOpen, selectContactAction } =
  useContactContextMenu(props, emit)
</script>

<template>
  <NmorphContextMenu
    placement="bottom-end"
    :model-value="isContextMenuOpen"
    class="contact-context-menu"
    trigger="click"
    :options="contextMenuOptions"
    :aria-label="$t(CONTACTS_PAGE_I18N.contactActions)"
    hide-shadow
    @update:model-value="setContextMenuOpen"
    @select="selectContactAction"
  >
    <NmorphBadge
      type="dot"
      :hidden="!showContactActionBadge"
      color="var(--nmorph-warn-color)"
      size="base"
      :offset-x="-6"
      :offset-y="-6"
    >
      <NmorphButton
        design="plain"
        borderless
        shape="square"
        thickness="basic"
        :aria-label="$t(CONTACTS_PAGE_I18N.contactActions)"
      >
        <template #icon-only>
          <NmorphIcon>
            <NmorphIconBurger />
          </NmorphIcon>
        </template>
      </NmorphButton>
    </NmorphBadge>
  </NmorphContextMenu>
</template>
