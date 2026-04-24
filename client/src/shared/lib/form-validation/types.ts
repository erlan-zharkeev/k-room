import type { LocalizedTextType } from 'global-shared'

export type FormFieldNameType<T extends object> = Extract<keyof T, string>
export type FormValidationRuleType<T = unknown> = (value: T) => LocalizedTextType | null
export type FormRulesType<T extends object> = Partial<{
  [Key in FormFieldNameType<T>]: FormValidationRuleType<T[Key]>[]
}>
export type FormErrorsType<T extends object> = Partial<Record<FormFieldNameType<T>, LocalizedTextType[]>>
export type FormTouchedType<T extends object> = Partial<Record<FormFieldNameType<T>, boolean>>
