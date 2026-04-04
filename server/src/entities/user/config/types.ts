import { InteractionType, ProviderType, UserRoleType } from 'common'

export interface IUserDevice {
  socketId: string
  refreshToken: string
}

export interface IUserSystemData {
  role: UserRoleType
  device: Record<string, IUserDevice>
  confirmed: boolean
  confirmAttempts: number
  password: string
  provider?: ProviderType
}

export interface IContact {
  id: string
  interaction: InteractionType
  updatedAt: number
}

export interface IUserPersonalData {
  email: string
  contacts: Record<string, IContact>
  chatRooms: string[]
}

export interface IUserPublicData {
  username: string
  online: boolean
  lastSeen: number
}

export interface IUserSchema {
  _id: string
  system: IUserSystemData
  personal: IUserPersonalData
  public: IUserPublicData
  createdAt?: Date
  updatedAt?: Date
}
