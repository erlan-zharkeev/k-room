import type { DbUserContactType } from 'src/shared/lib'

export const getContactActivityTagColor = ({ online }: DbUserContactType) =>
  online ? 'var(--nmorph-success-color)' : 'var(--nmorph-semi-contrast-text-color)'
