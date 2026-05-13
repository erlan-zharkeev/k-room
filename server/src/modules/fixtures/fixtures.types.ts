import type { InteractionType } from 'global-shared'

export interface IFixtureUserData {
  id: string
  email: string
  nickname: string
  pass: string
  avatarPath: string
}

export interface IFixtureContactData {
  nickname: string
  interaction: InteractionType
  reverseInteraction?: InteractionType
}
