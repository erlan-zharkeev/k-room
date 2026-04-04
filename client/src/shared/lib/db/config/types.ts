export type MutableType<T> = { -readonly [K in keyof T]: T[K] }
export type IndexableType = Record<string, any>

export interface KvOptions<KeyField extends string> {
  mode: 'kv'
  keyValue: string
  keyField?: KeyField
}

export interface IdOptions<T, IdField extends keyof T & string> {
  mode: 'id'
  idField: IdField
}

export type KvItem<T extends object> = T & { __key: string }
export type UseResult<T extends object, D extends Partial<T> | undefined> = D extends undefined ? T | undefined : D & T
export interface UseStateResult<T extends object, D extends Partial<T> | undefined> {
  data: UseResult<T, D>
  isReady: boolean
}
export interface KvQueryState<T extends object> {
  data: T | undefined
  isReady: true
}

export interface CollectionMergeManyOptions<T extends { id: string | number }> {
  merge: (current: T | undefined, incoming: T) => T
  removeMissing?: boolean
}
