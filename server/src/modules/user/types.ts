import type { ChangePasswordPayload, Interaction, MediaId, Provider, UnknownObject, UserRole } from 'global-shared'
import type { Types } from 'mongoose'

export interface UserDevice {
  refreshToken: string
}

export interface UserContact {
  id: string
  interaction: Interaction
  updatedAt: number
}

export interface UserSystemData {
  role: UserRole
  device: Record<string, UserDevice>
  confirmed: boolean
  confirmAttempts: number
  password: string
  provider?: Provider
}

export interface UserPersonalData {
  email: string
  contacts: Record<string, UserContact>
  chatRooms: string[]
  pinnedChatRoomIds: string[]
  mutedChatRoomIds: string[]
}

export interface UserPublicData {
  avatarId: MediaId
  nickname: string
  lastSeen: number
}

export interface UserSchema {
  _id: Types.ObjectId
  system: UserSystemData
  personal: UserPersonalData
  public: UserPublicData
  createdAt?: Date
  updatedAt?: Date
}

export interface UserExistState {
  exists: boolean
  reason: 'nickname' | 'email' | 'id' | null
}

export interface UserExistParams {
  nickname: string
  email: string
  id?: Types.ObjectId
}

export interface CreateUserParams {
  id?: Types.ObjectId
  email: string
  nickname: string
  hashedPassword: string
  provider?: Provider
}

export interface ChangePasswordParams extends ChangePasswordPayload {
  userId: string
}

export interface ChangeEmailParams {
  userId: string
  email: string
}

export interface UpdateUserDataParams {
  userId: string
  nickname?: string
  avatarFileBuffer?: Buffer
  resetAvatar?: 'reset' | ''
}

export interface UpdateUserDataPayload {
  nickname?: string
  'reset-avatar'?: 'reset' | ''
}

export interface AdminUserRecord {
  params?: UnknownObject
}

export interface AdminUserActionRequest {
  method?: string
  payload?: UnknownObject
}

export interface AdminUserActionResponse {
  record?: AdminUserRecord
  records?: AdminUserRecord[]
}
