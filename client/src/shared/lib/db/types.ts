import type { TransactionMode } from 'dexie'
import type {
  ICall,
  IChatRoom,
  IFrontendContact,
  IFrontendUserData,
  IMessage,
  MediaKindType,
  UnknownObjectType
} from 'global-shared'
import type { Ref } from 'vue'

export type MutableType<T> = { -readonly [K in keyof T]: T[K] }
export type IndexableType = UnknownObjectType
export type KvItemType<T extends object> = T & { __key: string }
export type UseResultType<T extends object, D extends Partial<T> | undefined> = D extends undefined
  ? T | undefined
  : D & T

export interface IDbCollectionItem {
  id: string | number
}

export interface ICollectionIncomingItem<ItemId extends IDbCollectionItem['id']> {
  id: ItemId
}

export interface IUseStateResult<T extends object, D extends Partial<T> | undefined> {
  data: Ref<UseResultType<T, D>>
  isReady: Ref<boolean>
}

export interface ICollectionMergeManyOptions<
  T extends IDbCollectionItem,
  Incoming extends ICollectionIncomingItem<T['id']> = T
> {
  merge: (current: T | undefined, incoming: Incoming) => T
  removeMissing?: boolean
}

export type DbTransactionModeType = TransactionMode

export type DbCallType = ICall
export type DbMessageType = IMessage
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
