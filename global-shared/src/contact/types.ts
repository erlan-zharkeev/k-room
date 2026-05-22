import type { UserPreviewType } from '../user/types'

export type InteractionType = 'default' | 'invited' | 'invite-accepted' | 'invite-received' | 'blocked'

export type ContactType = UserPreviewType & {
  online: boolean
  lastSeen: number
  interactionType: InteractionType
}

export type KnownUserType = Omit<ContactType, 'interactionType'>

export type ContactMapType = Record<string, ContactType>
