export type InteractionType = 'default' | 'invited' | 'invite-accepted' | 'invite-hidden' | 'invite-received'

export interface IFrontendContact {
  id: string
  nickname: string
  online: boolean
  lastSeen: number
  interactionType: InteractionType
}

export type FrontendContactMapType = Record<string, IFrontendContact>
