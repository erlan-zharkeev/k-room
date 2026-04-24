import type { TransactionMode } from 'dexie'
import type { UnknownObject } from 'global-shared'
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
