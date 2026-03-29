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
