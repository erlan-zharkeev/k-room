import { type Request } from 'express'
import { createValidationMessages, REQ_STATUS, type ValidationMessagesType } from 'global-shared'
import { getDotPath, safeParse, type GenericSchema } from 'valibot'

import { SHARED_I18N } from 'src/shared/i18n'

import { AppError } from './app-error'
import { localizedText } from './localized-text'

export const runRequestValidation = (
  request: Request,
  createSchema: (messages: ValidationMessagesType) => GenericSchema
) => {
  const { language } = request
  const messages = createValidationMessages((text) => localizedText(text, language))
  const result = safeParse(createSchema(messages), request.body, { abortPipeEarly: true })

  if (result.success) {
    return
  }

  const message = result.issues.find((issue) => Boolean(getDotPath(issue)))?.message ?? SHARED_I18N.commonServerError

  throw new AppError(REQ_STATUS.badRequest, message, false)
}
