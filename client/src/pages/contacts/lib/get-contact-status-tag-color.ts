import { isBlockedContactInteraction, isPendingContactInteraction } from 'global-shared'

import type { ContactRecord } from 'src/shared/lib'

export const getContactStatusTagColor = ({ interactionType }: ContactRecord) => {
  if (isBlockedContactInteraction(interactionType)) return 'var(--nmorph-warn-color)'
  if (isPendingContactInteraction(interactionType)) return 'var(--nmorph-accent-color)'

  return 'var(--nmorph-semi-contrast-text-color)'
}
