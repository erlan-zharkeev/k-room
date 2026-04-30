import { USER_ROLES } from './constants'

export type UserRoleType = (typeof USER_ROLES)[number]

export interface IBaseFrontendUserData {
  id: string
  nickname: string
}

export interface IFrontendUserData extends IBaseFrontendUserData {
  role: UserRoleType
  email: string
}
