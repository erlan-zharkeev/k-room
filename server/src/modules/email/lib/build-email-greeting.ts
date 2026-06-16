import type { BuildEmailGreetingParams } from '../email.types'

export const buildEmailGreeting = ({ greeting, nickname, punctuation }: BuildEmailGreetingParams) =>
  nickname ? `${greeting}, ${nickname}${punctuation}` : `${greeting}${punctuation}`
