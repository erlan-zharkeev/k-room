<script setup lang="ts">
import { NmorphDialog } from '@nmorph/nmorph-ui-kit'

import { APP_DIALOG_PROPS_DEFAULTS } from './constants'
import type { AppDialogEmits, AppDialogProps } from './types'
import { useAppDialog } from './use-app-dialog.model'

const model = defineModel<boolean>({ default: false })
const props = withDefaults(defineProps<AppDialogProps>(), APP_DIALOG_PROPS_DEFAULTS)
const emit = defineEmits<AppDialogEmits>()
const { appDialogWidth, appDialogMaxWidth } = useAppDialog(props)
</script>

<template>
  <NmorphDialog
    v-model="model"
    class="app-dialog"
    :title="props.title"
    :width="appDialogWidth"
    :max-width="appDialogMaxWidth"
    :max-height="props.maxHeight"
    :open-delay="props.openDelay"
    :close-delay="props.closeDelay"
    :show-close="props.showClose"
    :z-index="props.zIndex"
    :close-on-overlay="props.closeOnOverlay"
    :close-on-escape="props.closeOnEscape"
    @on-close="emit('on-close')"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <slot />
  </NmorphDialog>
</template>
