import type { Interaction } from 'global-shared'

export interface FixtureUserData {
  id: string
  email: string
  nickname: string
  pass: string
  avatarPath: string
}

export interface FixtureContactData {
  nickname: string
  interaction: Interaction
  reverseInteraction?: Interaction
}
