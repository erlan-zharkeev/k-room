export type AppDialogVariant = 'compact' | 'default' | 'wide'

export interface AppDialogProps {
  title?: string
  width?: string
  maxWidth?: string
  maxHeight?: string
  openDelay?: number
  closeDelay?: number
  showClose?: boolean
  zIndex?: number
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  variant?: AppDialogVariant
}

export interface AppDialogEmits {
  (e: 'on-close'): void
}
