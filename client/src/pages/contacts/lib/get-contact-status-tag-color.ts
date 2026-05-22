import type { ContactRecord } from 'src/shared/lib'

export const getContactStatusTagColor = ({ interactionType }: ContactRecord) => {
  if (interactionType === 'blocked') return 'var(--nmorph-warn-color)'
  if (interactionType === 'invited' || interactionType === 'invite-received') return 'var(--nmorph-accent-color)'

  return 'var(--nmorph-semi-contrast-text-color)'
}
