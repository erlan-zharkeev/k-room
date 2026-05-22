import type { ContactRecord } from 'src/shared/lib'

export const getContactActivityTagColor = ({ online }: ContactRecord) =>
  online ? 'var(--nmorph-success-color)' : 'var(--nmorph-semi-contrast-text-color)'
