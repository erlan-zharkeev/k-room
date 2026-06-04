export const TOP_BAR_OFFLINE_STATUS_DELAY_MS = 1200

export const LOCAL_STORAGE_KEY = {
  LogoutStatus: 'logout-status'
} as const

export const CALL_ACTIVITY_PANEL_KIND = {
  ACTIVE: 'active',
  INCOMING: 'incoming',
  JOINABLE: 'joinable',
  OUTGOING: 'outgoing'
} as const

export const CALL_ACTIVITY_PANEL_DOT_COLOR_BY_KIND = {
  [CALL_ACTIVITY_PANEL_KIND.ACTIVE]: 'var(--nmorph-success-color)',
  [CALL_ACTIVITY_PANEL_KIND.INCOMING]: 'var(--nmorph-warn-color)',
  [CALL_ACTIVITY_PANEL_KIND.JOINABLE]: 'var(--nmorph-success-color)',
  [CALL_ACTIVITY_PANEL_KIND.OUTGOING]: 'var(--nmorph-accent-color)'
} as const
