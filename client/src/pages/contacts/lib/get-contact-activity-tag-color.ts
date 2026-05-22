import type { ContactRecordType } from 'src/shared/lib'

export const getContactActivityTagColor = ({ online }: ContactRecordType) =>
  online ? 'var(--nmorph-success-color)' : 'var(--nmorph-semi-contrast-text-color)'
