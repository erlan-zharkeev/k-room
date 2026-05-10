<script setup lang="ts">
import { NmorphBadge, NmorphButton, NmorphContextMenu, NmorphIconMore } from '@nmorph/nmorph-ui-kit'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { IContactContextMenuEmits, IContactContextMenuProps } from '../config/types'
import { useContactContextMenu } from '../model/use-contact-context-menu.model'

const props = defineProps<IContactContextMenuProps>()
const emit = defineEmits<IContactContextMenuEmits>()
const { contactActionBadgeValue, contextMenuOptions, selectContactAction } = useContactContextMenu(props, emit)
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
