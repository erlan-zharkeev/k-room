import { USER_ROLES } from './constants'

export type UserRoleType = (typeof USER_ROLES)[number]

export type UserPreviewType = {
  id: string
  nickname: string
}

export type UserDataType = UserPreviewType & {
  role: UserRoleType
  email: string
}
