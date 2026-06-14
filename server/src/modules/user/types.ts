import type {
  ChangePasswordPayload,
  Interaction,
  Provider,
  UnknownObject,
  UserData,
  UserOnboardingData,
  UserPreview
} from 'global-shared'
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
  role: UserData['role']
  device: Record<string, UserDevice>
  confirmed: boolean
  confirmAttempts: number
  password: string
  provider?: Provider
}

export interface UserPersonalData extends Pick<UserData, 'email'> {
  contacts: Record<string, UserContact>
  chatRooms: string[]
  pinnedChatRoomIds: string[]
  mutedChatRoomIds: string[]
  onboarding?: UserOnboardingData
}

export interface UserPublicData extends Omit<UserPreview, 'id'> {
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

export interface UpdateUserOnboardingParams {
  userId: string
  welcomeCompleted?: boolean
  guideCompleted?: boolean
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

export type UserIdProjection = Pick<UserSchema, '_id'>

export type UserChatRoomsProjection = Pick<UserSchema, '_id'> & {
  personal: Pick<UserPersonalData, 'chatRooms'>
}

export type UserPublicProjection = Pick<UserSchema, '_id'> & {
  public: Pick<UserPublicData, 'avatarId' | 'nickname' | 'lastSeen'>
}

export type UserPublicNicknameProjection = Pick<UserSchema, '_id'> & {
  public: Pick<UserPublicData, 'nickname'>
}

export type UserContactsProjection = Pick<UserSchema, '_id'> & {
  personal: Pick<UserPersonalData, 'contacts'>
}

export type UserPinnedChatRoomIdsProjection = Pick<UserSchema, '_id'> & {
  personal: Pick<UserPersonalData, 'pinnedChatRoomIds'>
}

export type UserMutedChatRoomIdsProjection = Pick<UserSchema, '_id'> & {
  personal: Pick<UserPersonalData, 'mutedChatRoomIds'>
}

export type UserContactInteractionProjection = Pick<UserSchema, '_id'> & {
  personal: {
    contacts: Record<string, Pick<UserContact, 'interaction'> | undefined>
  }
}
