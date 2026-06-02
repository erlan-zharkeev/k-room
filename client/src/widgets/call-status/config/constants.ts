export const CALL_STATUS_KIND = {
  ACTIVE: 'active',
  INCOMING: 'incoming',
  JOINABLE: 'joinable',
  OUTGOING: 'outgoing'
} as const

export const CALL_STATUS_DOT_COLOR_BY_KIND = {
  [CALL_STATUS_KIND.ACTIVE]: 'var(--nmorph-success-color)',
  [CALL_STATUS_KIND.INCOMING]: 'var(--nmorph-warn-color)',
  [CALL_STATUS_KIND.JOINABLE]: 'var(--nmorph-success-color)',
  [CALL_STATUS_KIND.OUTGOING]: 'var(--nmorph-warn-color)'
} as const
