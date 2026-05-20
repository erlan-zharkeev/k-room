import type {
  AppLanguageType,
  IChangePasswordPayload,
  InteractionType,
  ProviderType,
  UnknownObjectType,
  UserRoleType
} from 'global-shared'
import type { Types } from 'mongoose'

export interface IUserDevice {
  refreshToken: string
}

export interface IContact {
  id: string
  interaction: InteractionType
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
  pinnedChatRoomIds: string[]
}

export interface IUserPublicData {
  nickname: string
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
  reason: 'nickname' | 'email' | 'id' | null
}

export interface IUserExistParams {
  nickname: string
  email: string
  id?: Types.ObjectId
}

export interface ICreateUserParams {
  id?: Types.ObjectId
  email: string
  nickname: string
  hashedPassword: string
  provider?: ProviderType
}

export interface IChangePasswordParams extends IChangePasswordPayload {
  userId: string
}

export interface IChangeEmailParams {
  userId: string
  email: string
}

export interface IUpdateUserDataParams {
  userId: string
  nickname?: string
  avatarFileBuffer?: Buffer
  resetAvatar?: 'reset' | ''
}

export interface IUpdateUserDataPayload {
  nickname?: string
  'reset-avatar'?: 'reset' | ''
}

export interface IAdminUserRecord {
  params?: UnknownObjectType
}

export interface IAdminUserActionRequest {
  method?: string
  payload?: UnknownObjectType
}

export interface IAdminUserActionResponse {
  record?: IAdminUserRecord
  records?: IAdminUserRecord[]
}

export interface IUpdateLanguagePayload {
  language: AppLanguageType
}
