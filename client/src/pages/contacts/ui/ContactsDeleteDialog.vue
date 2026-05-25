<script setup lang="ts">
import { NmorphButton, NmorphDialog } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { ContactsDeleteDialogEmits } from '../config/types'

const model = defineModel<boolean>({ required: true })
const emit = defineEmits<ContactsDeleteDialogEmits>()
</script>

<template>
  <NmorphDialog v-model="model" :title="$t(CONTACTS_PAGE_I18N.deleteTitle)">
    <div class="app-dialog-stack contacts-delete-dialog">
      <AppText :text="$t(CONTACTS_PAGE_I18N.deleteConfirm)" />
      <div class="app-dialog-actions">
        <NmorphButton :text="$t(CONTACTS_PAGE_I18N.cancel)" style-type="transparent" @click="emit('cancel')" />
        <NmorphButton
          style-type="transparent"
          color="var(--nmorph-error-text-color)"
          :text="$t(CONTACTS_PAGE_I18N.delete)"
          @click="emit('confirm')"
        />
      </div>
    </div>
  </NmorphDialog>
</template>

<style lang="scss">
.contacts-delete-dialog {
  gap: 16px;
}
</style>
