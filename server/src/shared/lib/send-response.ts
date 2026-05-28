import { type Response } from 'express'
import { type BackendResponse, isString, type LocalizedText } from 'global-shared'

import { localizedText } from './localized-text'

export const sendResponse = <TPayload>(
  response: Response<BackendResponse<TPayload>>,
  language: Parameters<typeof localizedText>[1],
  payload: TPayload,
  messageSource: string | LocalizedText<string>,
  silent: boolean
) => {
  return response.json({
    payload,
    message: {
      text: isString(messageSource) ? messageSource : localizedText(messageSource, language),
      silent
    }
  })
}
