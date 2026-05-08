import type { Ref } from 'vue'

export type ContextRefType<T = never> = Ref<T>

type KebabCaseTailType<T extends string> = T extends `${infer Head}${infer Tail}`
  ? Head extends Lowercase<Head>
    ? `${Head}${KebabCaseTailType<Tail>}`
    : `-${Lowercase<Head>}${KebabCaseTailType<Tail>}`
  : T

export type KebabCaseType<T extends string> = T extends `${infer Head}${infer Tail}`
  ? `${Lowercase<Head>}${KebabCaseTailType<Tail>}`
  : T

export interface IFormFieldValidationState {
  invalid?: boolean
  dirty?: boolean
  touched?: boolean
}
