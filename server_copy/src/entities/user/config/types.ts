import { UserRoleType, ChatRoomsType } from 'common-types'

export interface IUserSystemData {
  socketIds: string[]
  refreshToken: string
  confirmed: boolean
  confirmAttempts: number
  password: string
}

export interface IUserPersonalData {
  role: UserRoleType
  contacts: string[]
  chatRooms: string[]
  unreadInfoNotifications: string[]
}

export interface IUserPublicData {
  username: string
  email: string
  avatar: string
  online: boolean
  lastSeen: number
}
