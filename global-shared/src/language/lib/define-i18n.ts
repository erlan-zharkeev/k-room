import type { UnknownObject } from '../../shared/types'

import type { I18nRecordConstraintType } from './types'

export const defineI18n = <const T extends UnknownObject>(value: I18nRecordConstraintType<T>) => value
