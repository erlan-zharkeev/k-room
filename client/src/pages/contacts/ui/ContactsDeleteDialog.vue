<script setup lang="ts">
import { NmorphButton, NmorphDialog } from '@nmorph/nmorph-ui-kit'

import { AppText } from 'src/shared/ui'

import { CONTACTS_PAGE_I18N } from '../config/i18n'
import type { IContactsDeleteDialogEmits, IContactsDeleteDialogProps } from '../config/types'

const props = defineProps<IContactsDeleteDialogProps>()
const emit = defineEmits<IContactsDeleteDialogEmits>()
</script>

<template>
  <NmorphDialog
    :model-value="props.modelValue"
    :title="$t(CONTACTS_PAGE_I18N.deleteTitle)"
    @update:model-value="($event) => emit('update:model-value', $event)"
  >
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
