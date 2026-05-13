import type { InteractionType } from 'global-shared'

export type ContactE2EUserRoleType = 'author' | 'interlocutor'

export interface IContactE2EUser {
  id: string
  nickname: string
  email: string
}

export interface IContactE2EProviderLoginResponse {
  payload: {
    id: string
    nickname: string
    email: string
  }
}

export interface IContactE2EIndexedDbContact {
  id: string
  nickname: string
  interactionType: InteractionType
}

export interface IContactE2EIndexedDbChatRoom {
  id: string
  users: string[]
}
