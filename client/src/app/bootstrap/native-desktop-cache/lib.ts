import { isString } from 'global-shared'

import { getClientPlatform } from 'src/shared/lib'

import { DYNAMIC_IMPORT_ERROR_MESSAGES } from './constants'

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message
  if (isString(error)) return error

  return ''
}

export const isNativeDesktopClient = () => getClientPlatform() === 'native'

export const isDynamicImportFetchError = (error: unknown) => {
  const message = getErrorMessage(error).toLowerCase()

  return Boolean(message && DYNAMIC_IMPORT_ERROR_MESSAGES.some((errorMessage) => message.includes(errorMessage)))
}
