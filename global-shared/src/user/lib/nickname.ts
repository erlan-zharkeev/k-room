import { VALIDATION_PATTERNS } from '../../auth/constants'

import { USER_NICKNAME_MAX_LENGTH, USER_NICKNAME_MIN_LENGTH } from '../constants'

const nicknamePattern = new RegExp(VALIDATION_PATTERNS.nickname)

export const normalizeNickname = (value: string) => value.trim().replace(/^@+/, '')

export const normalizeNicknameKey = (value: string) => normalizeNickname(value).toLowerCase()

export const isNicknameValid = (value: string) => {
  const nickname = normalizeNickname(value)

  return (
    nickname.length >= USER_NICKNAME_MIN_LENGTH &&
    nickname.length <= USER_NICKNAME_MAX_LENGTH &&
    nicknamePattern.test(nickname)
  )
}

export const formatNickname = (value: string) => {
  const nickname = normalizeNickname(value)

  return nickname ? `@${nickname}` : ''
}
