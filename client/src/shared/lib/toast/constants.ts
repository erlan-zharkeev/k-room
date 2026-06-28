export const TOAST_LIFE_MS = {
  success: 2_000,
  info: 4_000,
  warning: 60_000,
  error: 10_000
} as const

export const TOAST_PLACEMENT = {
  call: 'top-right',
  system: 'top-center',
  message: 'top-right'
} as const
