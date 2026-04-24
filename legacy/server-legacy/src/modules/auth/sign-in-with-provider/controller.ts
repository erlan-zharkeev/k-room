import bcrypt from 'bcryptjs'
import { ISignInWithProviderPayload, ISignInWithProviderResponse, REQ_STATUS } from 'common'
import { v4 as uuidv4 } from 'uuid'

import { createUser, mapUserToDto, updateUserAvatar } from 'src/modules/user'
import { loadGoogleAvatar } from 'src/modules/user'
import { UserModel } from 'src/modules/user'

import { AppResponseType, IAppRequest, SHARED_I18N } from 'src/shared/config'
import { localizedText } from 'src/shared/lib/localized-text'
import { throwHTTPError } from 'src/shared/lib/throw-error'

import { updateTokens } from '../shared/lib/update-token'

import { SIGN_IN_WITH_PROVIDER_I18N } from './i18n'

export const signInWithProviderController = async (
  req: IAppRequest,
  res: AppResponseType<ISignInWithProviderResponse>
) => {
  const { language } = req
  const basicError = localizedText(SIGN_IN_WITH_PROVIDER_I18N.failed, language)

  try {
    const data: ISignInWithProviderPayload = req.body
    const { username, email, provider, avatar } = data

    const hashedPassword = await bcrypt.hash(uuidv4(), 6)
    const newUser = await createUser({ username, email, provider, hashedPassword })
    const user = newUser ?? (await UserModel.findOne({ 'personal.email': email }))

    if (newUser && avatar) {
      const buffer = await loadGoogleAvatar(avatar)
      if (buffer) await updateUserAvatar(buffer, String(newUser._id), language)
    }

    if (!user) return throwHTTPError(REQ_STATUS.badRequest, res, basicError)

    await updateTokens(user.id, req, res)

    return res.json({
      payload: mapUserToDto(user),
      message: {
        text: localizedText(SHARED_I18N.success, language),
        silent: true
      }
    })
  } catch (error) {
    throwHTTPError(REQ_STATUS.server, res, basicError, false, error)
  }
}
