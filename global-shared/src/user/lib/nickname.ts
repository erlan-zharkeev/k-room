import { VALIDATION_PATTERNS } from '../../auth/constants'

const nicknamePattern = new RegExp(VALIDATION_PATTERNS.nickname)

export const normalizeNickname = (value: string) => value.trim().replace(/^@+/, '')

export const normalizeNicknameKey = (value: string) => normalizeNickname(value).toLowerCase()

export const isNicknameValid = (value: string) => nicknamePattern.test(normalizeNickname(value))

export const formatNickname = (value: string) => {
  const nickname = normalizeNickname(value)

  return nickname ? `@${nickname}` : ''
}
