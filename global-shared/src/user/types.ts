import { USER_ROLES } from './constants'

export type UserRole = (typeof USER_ROLES)[number]

export type UserPreview = {
  id: string
  nickname: string
}

export type UserData = UserPreview & {
  role: UserRole
  email: string
}
