import type { ChatKind, Interaction } from 'global-shared'

export type ContactE2EUserRole = 'author' | 'interlocutor'

export interface ContactE2EUser {
  id: string
  nickname: string
  email: string
}

export interface ContactE2EProviderLoginResponse {
  payload: {
    id: string
    nickname: string
    email: string
  }
}

export interface ContactE2EIndexedDbContact {
  id: string
  nickname: string
  interactionType: Interaction
}

export interface ContactE2EIndexedDbChatRoom {
  id: string
  chatKind: ChatKind
  users: string[]
}
