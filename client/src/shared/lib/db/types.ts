import type { TransactionMode } from 'dexie'
import type {
  CallType,
  ChatRoomType,
  ContactType,
  KnownUserType,
  UserDataType,
  MessageType,
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

export type DexieTransactionModeType = TransactionMode

export type CallRecordType = CallType
export type MessageRecordType = MessageType
export type ChatRoomRecordType = ChatRoomType
export type UserRecordType = Required<Pick<UserDataType, 'id' | 'role' | 'email' | 'nickname'>>
export type ContactRecordType = ContactType & ContactLocalStateType
export type KnownUserRecordType = KnownUserType & KnownUserLocalStateType
export type MediaRecordStatusType = 'missing' | 'ready'

export type ContactLocalStateType = {
  savedAt: number
  isTyping: boolean
}

export type KnownUserLocalStateType = {
  isTyping: boolean
}

export interface MediaRecordType {
  id: string
  blob?: Blob
  contentType?: string
  etag?: string
  kind?: MediaKindType
  lastModified?: string
  lastChecked: number
  status?: MediaRecordStatusType
}
