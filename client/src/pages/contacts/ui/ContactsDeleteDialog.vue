<script setup lang="ts">
import { NmorphButton, NmorphDialog } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { IContactsDeleteDialogEmits } from '../config/types'

const model = defineModel<boolean>({ required: true })
const emit = defineEmits<IContactsDeleteDialogEmits>()
</script>

<template>
  <NmorphDialog v-model="model" :title="$t(CONTACTS_PAGE_I18N.deleteTitle)">
    <div class="contacts-delete-dialog">
      <AppText :text="$t(CONTACTS_PAGE_I18N.deleteConfirm)" />
      <div class="contacts-delete-dialog__actions">
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
  display: grid;
  gap: 16px;
}

.contacts-delete-dialog__actions {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
}
</style>
