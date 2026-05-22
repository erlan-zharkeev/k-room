import type { Ref } from 'vue'

export type ContextRef<T = never> = Ref<T>

type KebabCaseTail<T extends string> = T extends `${infer Head}${infer Tail}`
  ? Head extends Lowercase<Head>
    ? `${Head}${KebabCaseTail<Tail>}`
    : `-${Lowercase<Head>}${KebabCaseTail<Tail>}`
  : T

export type KebabCase<T extends string> = T extends `${infer Head}${infer Tail}`
  ? `${Lowercase<Head>}${KebabCaseTail<Tail>}`
  : T

export interface FormFieldValidationState {
  invalid?: boolean
  dirty?: boolean
  touched?: boolean
}
