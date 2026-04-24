import { validationResult, type ValidationChain } from 'express-validator'
import { REQ_STATUS, type LocalizedTextType } from 'shared'

import { SHARED_I18N } from '../config/i18n'

import { AppError } from './app-error'
import { localizedText } from './localized-text'

export const runRequestValidation = async (
  request: { language?: 'en' | 'ru' } & Parameters<ValidationChain['run']>[0],
  validations: ValidationChain[]
) => {
  await Promise.all(validations.map((validation) => validation.run(request)))

  const errors = validationResult(request)
  if (errors.isEmpty()) {
    return
  }

  const messageSource =
    (errors.array()[0]?.msg as LocalizedTextType<string> | undefined) ?? SHARED_I18N.commonServerError

  throw new AppError(REQ_STATUS.badRequest, localizedText(messageSource, request.language), false)
}
