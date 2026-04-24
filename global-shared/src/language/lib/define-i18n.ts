import { I18nRecordConstraintType } from './types'

export const defineI18n = <const T extends Record<string, unknown>>(value: I18nRecordConstraintType<T>) => value
