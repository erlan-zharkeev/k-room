import type { UserPreview } from '../user/types'

export type Interaction = 'default' | 'invited' | 'invite-accepted' | 'invite-received' | 'blocked'

export type Contact = UserPreview & {
  online: boolean
  lastSeen: number
  interactionType: Interaction
}

export type KnownUser = Omit<Contact, 'interactionType'>

export type ContactMap = Record<string, Contact>
