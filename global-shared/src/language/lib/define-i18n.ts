import type { UnknownObject } from '../../shared/types'

import type { I18nRecordConstraint } from './types'

export const defineI18n = <const T extends UnknownObject>(value: I18nRecordConstraint<T>) => value
