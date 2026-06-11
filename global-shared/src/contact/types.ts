import type { UserPreview } from '../user/types'

import { type CONTACT_INTERACTION } from './constants'

export type Interaction = (typeof CONTACT_INTERACTION)[keyof typeof CONTACT_INTERACTION]

export type Contact = UserPreview & {
  online: boolean
  lastSeen: number
  interactionType: Interaction
}

export type KnownUser = Omit<Contact, 'interactionType'>

export type ContactMap = Record<string, Contact>

export interface EventStatusContact {
  interlocutorId: string
  online: boolean
  onlineStatusUpdatedTimestamp: number
  lastSeen?: number
}

export interface EventGetContacts {
  contacts: Contact[]
  knownUsers: KnownUser[]
}

export type EventKnownUsersUpdated = KnownUser[]

export interface EventSaveContact {
  interlocutorId: string
}

export interface EventDeleteContact {
  deletingUserId: string
}

export interface EventSearchContact {
  value: string
  offset?: number
}

export interface EventGetSearchedContact {
  value: string
  offset: number
  contacts: Contact[]
  total: number
  hasMore: boolean
  nextOffset?: number
}

export interface EventGetContactTypingStatus {
  contactId: string
  isTyping: boolean
}

export interface EventUpdateInteraction {
  contactId: string
  interaction: Interaction
}

export interface EventUpdateContactInteractionSuccess {
  contactId: string
  interaction: Interaction
}

export interface EventContactAddSuccess {
  contactData: Contact
}

export interface EventDeleteContactSuccess {
  deletedContactId: string
  silent: boolean
}
