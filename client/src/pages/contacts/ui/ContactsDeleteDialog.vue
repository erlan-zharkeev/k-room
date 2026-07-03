<script setup lang="ts">
import { NmorphText, NmorphButton } from '@nmorph/nmorph-ui-kit'

import { AppDialog } from 'src/shared/ui'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { ContactsDeleteDialogEmits } from '../config/types'

const model = defineModel<boolean>({ required: true })
const emit = defineEmits<ContactsDeleteDialogEmits>()
</script>

<template>
  <AppDialog v-model="model" :title="$t(CONTACTS_PAGE_I18N.deleteTitle)">
    <div class="app-dialog-stack contacts-delete-dialog">
      <NmorphText>{{ $t(CONTACTS_PAGE_I18N.deleteConfirm) }}</NmorphText>
      <div class="app-dialog-actions">
        <NmorphButton :text="$t(CONTACTS_PAGE_I18N.cancel)" design="plain" borderless @click="emit('cancel')" />
        <NmorphButton
          design="plain"
          borderless
          color="var(--nmorph-error-text-color)"
          :text="$t(CONTACTS_PAGE_I18N.delete)"
          @click="emit('confirm')"
        />
      </div>
    </div>
  </AppDialog>
</template>

<style lang="scss" scoped>
.contacts-delete-dialog {
  gap: 16px;
}
</style>
