import type { Interaction } from 'global-shared'

export interface FixtureUserData {
  id: string
  email: string
  nickname: string
  pass: string
  avatarId: string
  avatarPath: string
}

export interface FixtureGroupData {
  key: string
  adminNickname: string
  chatName: string
  avatarId: string
  avatarPath: string
  nicknames: readonly string[]
}

export interface FixtureContactData {
  nickname: string
  interaction: Interaction
  reverseInteraction?: Interaction
}

export interface FixtureMessageReactionData {
  nickname: string
  glyphKey: string
}

export interface FixtureMessageData {
  authorNickname: string
  body: string
  imageIds: readonly string[]
  reactions: readonly FixtureMessageReactionData[]
  replyToIndex: number | null
}
