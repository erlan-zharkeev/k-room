import type { LocalizedText } from '../language/types'

import { VALIDATION_I18N } from './i18n'
import type { ValidationMessages } from './types'

export const createValidationMessages = (translate: (value: LocalizedText) => string): ValidationMessages =>
  Object.fromEntries(
    Object.entries(VALIDATION_I18N).map(([key, value]) => [key, translate(value)])
  ) as ValidationMessages
