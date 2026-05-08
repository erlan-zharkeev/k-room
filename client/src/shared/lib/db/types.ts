import type { TransactionMode } from 'dexie'
import type {
  ICall,
  IChatRoom,
  IFrontendContact,
  IFrontendUserData,
  IMessage,
  IUserInfoNotification,
  MediaKindType,
  UnknownObject
} from 'global-shared'
import type { Ref } from 'vue'

export type MutableType<T> = { -readonly [K in keyof T]: T[K] }
export type IndexableType = UnknownObject
export type KvItem<T extends object> = T & { __key: string }
export type UseResult<T extends object, D extends Partial<T> | undefined> = D extends undefined ? T | undefined : D & T

export interface IUseStateResult<T extends object, D extends Partial<T> | undefined> {
  data: Ref<UseResult<T, D>>
  isReady: Ref<boolean>
}

export interface ICollectionMergeManyOptions<T extends { id: string | number }, Incoming extends { id: T['id'] } = T> {
  merge: (current: T | undefined, incoming: Incoming) => T
  removeMissing?: boolean
}

export type DbTransactionModeType = TransactionMode

export type DbCallType = ICall
export type DbMessageType = IMessage
export type DbInfoNotificationType = IUserInfoNotification
export type FChatRoomType = IChatRoom & { avatarId: string }
export type DbUserDataType = Required<Pick<IFrontendUserData, 'id' | 'role' | 'email' | 'nickname'>>
export type DbContactType = IFrontendContact & IDbContactRequiredSystemData
export type DbMediaStatusType = 'missing' | 'ready'

export interface IDbContactRequiredSystemData {
  savedAt: number
  onlineStatusSyncedAt: number
  isTyping: boolean
}

export interface IDbMedia {
  id: string
  blob?: Blob
  contentType?: string
  etag?: string
  kind?: MediaKindType
  lastModified?: string
  lastChecked: number
  status?: DbMediaStatusType
}
