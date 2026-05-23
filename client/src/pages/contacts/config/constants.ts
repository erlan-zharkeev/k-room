import { CONTACT_INTERACTION, type Interaction } from 'global-shared'

import { CONTACTS_PAGE_I18N } from './i18n'
import type { ContactsSearchBadgeData } from './types'

export const CONTACTS_PAGE_SEARCH_QUERY_KEY = 'search-contact'
export const CONTACTS_PAGE_SEARCH_DEBOUNCE_MS = 300

export const CONTACTS_SEARCH_BADGE_BY_INTERACTION = {
  [CONTACT_INTERACTION.DEFAULT]: {
    color: 'var(--nmorph-accent-color)',
    label: CONTACTS_PAGE_I18N.invited,
    visible: false
  },
  [CONTACT_INTERACTION.BLOCKED]: {
    color: 'var(--nmorph-warn-color)',
    label: CONTACTS_PAGE_I18N.blocked,
    visible: true
  },
  [CONTACT_INTERACTION.INVITED]: {
    color: 'var(--nmorph-accent-color)',
    label: CONTACTS_PAGE_I18N.invited,
    visible: true
  },
  [CONTACT_INTERACTION.INVITE_ACCEPTED]: {
    color: 'var(--nmorph-accent-color)',
    label: CONTACTS_PAGE_I18N.invited,
    visible: false
  },
  [CONTACT_INTERACTION.INVITE_RECEIVED]: {
    color: 'var(--nmorph-accent-color)',
    label: CONTACTS_PAGE_I18N.inviteReceived,
    visible: true
  }
} as const satisfies Record<Interaction, ContactsSearchBadgeData>
