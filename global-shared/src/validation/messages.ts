import type { LocalizedTextType } from '../language/types'

import { VALIDATION_I18N } from './i18n'
import type { ValidationMessagesType } from './types'

export const createValidationMessages = (translate: (value: LocalizedTextType) => string): ValidationMessagesType =>
  Object.fromEntries(
    Object.entries(VALIDATION_I18N).map(([key, value]) => [key, translate(value)])
  ) as ValidationMessagesType
