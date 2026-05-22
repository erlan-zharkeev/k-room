import { Interaction, Provider, UserRole } from 'common'

export interface UserDevice {
  socketId: string
  refreshToken: string
}

export interface UserSystemData {
  role: UserRole
  device: Record<string, UserDevice>
  confirmed: boolean
  confirmAttempts: number
  password: string
  provider?: Provider
}

export interface UserContact {
  id: string
  interaction: Interaction
  updatedAt: number
}

export interface UserPersonalData {
  email: string
  contacts: Record<string, UserContact>
  chatRooms: string[]
}

export interface UserPublicData {
  username: string
  online: boolean
  lastSeen: number
}

export interface UserSchema {
  _id: string
  system: UserSystemData
  personal: UserPersonalData
  public: UserPublicData
  createdAt?: Date
  updatedAt?: Date
}

export interface AdminRecord {
  params?: Record<string, unknown>
}

export interface AdminActionResponse {
  record?: AdminRecord
  records?: AdminRecord[]
}

export interface AdminActionRequest {
  method?: string
  payload?: Record<string, unknown>
}
