import { type Interaction } from 'global-shared'

import { CONTACTS_PAGE_I18N } from './i18n'
import type { ContactsSearchBadgeData } from './types'

export const CONTACTS_PAGE_SEARCH_QUERY_KEY = 'search-contact'
export const CONTACTS_PAGE_SEARCH_DEBOUNCE_MS = 300

export const CONTACTS_SEARCH_BADGE_BY_INTERACTION = {
  ['default']: {
    color: 'var(--nmorph-accent-color)',
    label: CONTACTS_PAGE_I18N.invited,
    visible: false
  },
  ['blocked']: {
    color: 'var(--nmorph-warn-text-color)',
    label: CONTACTS_PAGE_I18N.blocked,
    visible: true
  },
  ['invited']: {
    color: 'var(--nmorph-accent-color)',
    label: CONTACTS_PAGE_I18N.invited,
    visible: true
  },
  ['invite-accepted']: {
    color: 'var(--nmorph-accent-color)',
    label: CONTACTS_PAGE_I18N.invited,
    visible: false
  },
  ['invite-received']: {
    color: 'var(--nmorph-accent-color)',
    label: CONTACTS_PAGE_I18N.inviteReceived,
    visible: true
  }
} as const satisfies Record<Interaction, ContactsSearchBadgeData>
