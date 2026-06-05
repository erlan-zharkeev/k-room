import { VALIDATION_PATTERNS } from '../../auth/constants'
import { USER_NICKNAME_MAX_LENGTH, USER_NICKNAME_MIN_LENGTH } from '../constants'

const nicknamePattern = new RegExp(VALIDATION_PATTERNS.nickname)

export const normalizeNicknameKey = (value: string) => value.trim().toLowerCase()

export const isNicknameValid = (value: string) => {
  return (
    value.length >= USER_NICKNAME_MIN_LENGTH && value.length <= USER_NICKNAME_MAX_LENGTH && nicknamePattern.test(value)
  )
}
