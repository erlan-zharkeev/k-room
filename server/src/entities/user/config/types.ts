import type { InfoNotificationMapType, ProviderType, UserRoleType } from 'common-types'

export interface IUserDevice {
  socketId: string
  refreshToken: string
}

export interface IUserSystemData {
  device: Record<string, IUserDevice>
  confirmed: boolean
  confirmAttempts: number
  password: string
  provider?: ProviderType
}

export interface IUserPersonalData {
  role: UserRoleType
  contacts: string[]
  chatRooms: string[]
  infoNotifications: InfoNotificationMapType
}

export interface IUserPublicData {
  username: string
  email: string
  online: boolean
  lastSeen: number
}

export interface IUserSchema {
  id: string
  system: IUserSystemData
  personal: IUserPersonalData
  public: IUserPublicData
}
