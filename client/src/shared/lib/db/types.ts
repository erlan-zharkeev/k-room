import type { TransactionMode } from 'dexie'
import type { Call, ChatRoom, Contact, KnownUser, UserData, Message, MediaKind, UnknownObject } from 'global-shared'
import type { Ref } from 'vue'

export type Mutable<T> = { -readonly [K in keyof T]: T[K] }
export type Indexable = UnknownObject
export type KvItem<T extends object> = T & { __key: string }
export type UseResult<T extends object, D extends Partial<T> | undefined> = D extends undefined ? T | undefined : D & T

export interface DbCollectionItem {
  id: string | number
}

export interface CollectionIncomingItem<ItemId extends DbCollectionItem['id']> {
  id: ItemId
}

export interface UseStateResult<T extends object, D extends Partial<T> | undefined> {
  data: Ref<UseResult<T, D>>
  isReady: Ref<boolean>
}

export interface CollectionMergeManyOptions<
  T extends DbCollectionItem,
  Incoming extends CollectionIncomingItem<T['id']> = T
> {
  merge: (current: T | undefined, incoming: Incoming) => T
  removeMissing?: boolean
}

export type DexieTransactionMode = TransactionMode
export type DexieCacheTrimEventType = 'cache-trimmed' | 'cache-trim-failed'

export interface DexieCacheTrimResult {
  trimmed: boolean
}

export interface DexieCacheTrimmer {
  id: string
  priority: number
  trim: () => Promise<DexieCacheTrimResult>
}

export interface DexieErrorLike extends UnknownObject {
  failures?: unknown
  inner?: unknown
  name?: unknown
}

export interface DexieCacheTrimEvent {
  type: DexieCacheTrimEventType
}

export type CallRecord = Call
export type MessageRecord = Message
export type ChatRoomRecord = ChatRoom
export type UserRecord = Required<Pick<UserData, 'id' | 'role' | 'email' | 'nickname'>>
export type ContactRecord = Contact & ContactLocalState
export type KnownUserRecord = KnownUser & KnownUserLocalState
export type MediaRecordStatus = 'missing' | 'ready'

export type ContactLocalState = {
  savedAt: number
  isTyping: boolean
}

export type KnownUserLocalState = {
  isTyping: boolean
}

export interface MediaRecord {
  id: string
  blob?: Blob
  contentType?: string
  etag?: string
  kind?: MediaKind
  lastModified?: string
  lastChecked: number
  status?: MediaRecordStatus
}
