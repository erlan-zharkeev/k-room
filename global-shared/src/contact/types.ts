import type { UserPreview } from '../user/types'

import { CONTACT_INTERACTION } from './constants'

export type Interaction = (typeof CONTACT_INTERACTION)[keyof typeof CONTACT_INTERACTION]

export type Contact = UserPreview & {
  online: boolean
  lastSeen: number
  interactionType: Interaction
}

export type KnownUser = Omit<Contact, 'interactionType'>

export type ContactMap = Record<string, Contact>
