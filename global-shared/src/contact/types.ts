import type { IBaseFrontendUserData } from '../user/types'

export type InteractionType = 'default' | 'invited' | 'invite-accepted' | 'invite-received' | 'blocked'

export interface IFrontendContact extends IBaseFrontendUserData {
  online: boolean
  lastSeen: number
  interactionType: InteractionType
}

export type IFrontendRoomMemberContact = Omit<IFrontendContact, 'interactionType'>

export type FrontendContactMapType = Record<string, IFrontendContact>
