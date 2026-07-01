import { computed } from 'vue'

import { APP_DIALOG_DEFAULT_VARIANT, APP_DIALOG_MAX_WIDTH, APP_DIALOG_VARIANT_WIDTHS } from './constants'
import type { AppDialogProps } from './types'

export const useAppDialog = (props: AppDialogProps) => {
  const appDialogWidth = computed(
    () => props.width ?? APP_DIALOG_VARIANT_WIDTHS[props.variant ?? APP_DIALOG_DEFAULT_VARIANT]
  )
  const appDialogMaxWidth = computed(() => props.maxWidth ?? APP_DIALOG_MAX_WIDTH)

  return {
    appDialogWidth,
    appDialogMaxWidth
  }
}
