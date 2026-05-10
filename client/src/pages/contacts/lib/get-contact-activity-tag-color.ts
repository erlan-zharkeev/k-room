import type { DbContactType } from 'src/shared/lib'

export const getContactActivityTagColor = ({ online }: DbContactType) =>
  online ? 'var(--nmorph-success-color)' : 'var(--nmorph-semi-contrast-text-color)'
