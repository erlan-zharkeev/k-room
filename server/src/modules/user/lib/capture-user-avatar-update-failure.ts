import { REQ_STATUS, type UpdateUserDataPayload } from 'global-shared'

import { isAppError } from 'src/shared/lib/app-error'
import { errorToMessage } from 'src/shared/lib/error-to-message'
import { log } from 'src/shared/lib/log'
import { serverCaptureSentryScopedException } from 'src/shared/lib/sentry'

const resolveFileExtension = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase()

  return extension && extension !== filename.toLowerCase() ? extension : ''
}

const readFileSignatureHex = (buffer?: Buffer) => buffer?.subarray(0, 32).toString('hex') ?? null

const buildUserAvatarUpdateFailureContext = (file: Express.Multer.File, payload?: UpdateUserDataPayload) => ({
  file: {
    encoding: file.encoding || null,
    extension: resolveFileExtension(file.originalname),
    fieldname: file.fieldname,
    mimetype: file.mimetype || null,
    originalNameLength: file.originalname.length,
    signatureHex: readFileSignatureHex(file.buffer),
    size: file.size
  },
  request: {
    hasNickname: Boolean(payload?.nickname),
    resetAvatar: payload?.['reset-avatar'] === 'reset'
  }
})

export const captureUserAvatarUpdateFailure = (
  error: unknown,
  file: Express.Multer.File,
  payload?: UpdateUserDataPayload
) => {
  if (isAppError(error) && error.status !== REQ_STATUS.server) return

  const context = buildUserAvatarUpdateFailureContext(file, payload)

  log.error('-User avatar update failed')
  log.error(`-${JSON.stringify(context)}`)
  log.error(`-${errorToMessage(error)}`)

  serverCaptureSentryScopedException(error, (scope) => {
    scope.setTag('user.update.reason', 'avatar')
    scope.setContext('user_avatar_upload', context)
  })
}
