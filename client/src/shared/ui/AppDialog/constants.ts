import type { AppDialogProps, AppDialogVariant } from './types'

export const APP_DIALOG_DEFAULT_VARIANT: AppDialogVariant = 'compact'

export const APP_DIALOG_MAX_WIDTH = 'calc(100vw - 32px)'

export const APP_DIALOG_VARIANT_WIDTHS = {
  compact: '330px',
  default: '420px',
  wide: '560px'
} satisfies Record<AppDialogVariant, string>

export const APP_DIALOG_PROPS_DEFAULTS = {
  closeOnEscape: true,
  closeOnOverlay: true,
  showClose: true,
  variant: APP_DIALOG_DEFAULT_VARIANT
} satisfies Partial<AppDialogProps>
