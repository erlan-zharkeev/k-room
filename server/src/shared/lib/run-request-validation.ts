import { type Request } from 'express'
import { validationResult, type ValidationChain } from 'express-validator'
import { REQ_STATUS, type LocalizedTextType } from 'shared'

import { SHARED_I18N } from 'src/shared/config/i18n'

import { AppError } from './app-error'
import { localizedText } from './localized-text'

export const runRequestValidation = async (request: Request, validations: ValidationChain[]) => {
  const { language } = request

  await Promise.all(validations.map((validation) => validation.run(request)))

  const errors = validationResult(request)
  if (errors.isEmpty()) {
    return
  }

  const messageSource =
    (errors.array()[0]?.msg as LocalizedTextType<string> | undefined) ?? SHARED_I18N.commonServerError

  throw new AppError(REQ_STATUS.badRequest, localizedText(messageSource, language), false)
}
