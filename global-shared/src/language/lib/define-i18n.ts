import type { UnknownObjectType } from '../../shared/types'

import type { I18nRecordConstraintType } from './types'

export const defineI18n = <const T extends UnknownObjectType>(value: I18nRecordConstraintType<T>) => value
