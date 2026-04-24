import type { Types } from 'mongoose'
import type { ProviderType, UserRoleType } from 'shared'

export interface IUserDevice {
  socketId: string
  refreshToken: string
}

export interface IContact {
  id: string
  interaction: 'default' | 'invited' | 'invite-accepted' | 'invite-hidden' | 'invite-received'
  updatedAt: number
}

export interface IUserSystemData {
  role: UserRoleType
  device: Record<string, IUserDevice>
  confirmed: boolean
  confirmAttempts: number
  password: string
  provider?: ProviderType
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
  _id: Types.ObjectId
  system: IUserSystemData
  personal: IUserPersonalData
  public: IUserPublicData
  createdAt?: Date
  updatedAt?: Date
}

export interface IUserExistState {
  exists: boolean
  reason: 'username' | 'email' | 'id' | null
}
