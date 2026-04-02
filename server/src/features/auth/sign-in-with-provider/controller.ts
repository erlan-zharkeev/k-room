import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

import { ISignInWithProviderPayload, ISignInWithProviderResponse, StatusEnum } from 'common'

import { createUser, mapUserToDto, updateUserAvatar } from 'src/features/user'
import { loadGoogleAvatar } from 'src/features/user'

import { UserModel } from 'src/entities/user'

import { AppResponseType, type IAppRequest, SHARED_I18N } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import { updateTokens } from './../shared'
import { SIGN_IN_WITH_PROVIDER_I18N } from './config'

export const signInWithProviderController = async (
  req: IAppRequest,
  res: AppResponseType<ISignInWithProviderResponse>
) => {
  const { language } = req
  const basicError = getLocalizedText(SIGN_IN_WITH_PROVIDER_I18N.failed, language)

  try {
    const data: ISignInWithProviderPayload = req.body
    const { username, email, provider, avatar } = data

    const hashedPassword = await bcrypt.hash(uuidv4(), 6)
    const newUser = await createUser({ username, email, provider, hashedPassword })
    const user = newUser ?? (await UserModel.findOne({ 'personal.email': email }))

    if (newUser && avatar) {
      const buffer = await loadGoogleAvatar(avatar)
      if (buffer) await updateUserAvatar(buffer, String(newUser._id))
    }

    if (!user) return throwHTTPError(StatusEnum.BadRequest, res, basicError)

    await updateTokens(user.id, req, res)

    return res.json({
      payload: mapUserToDto(user),
      message: {
        text: getLocalizedText(SHARED_I18N.success, language),
        silent: true
      }
    })
  } catch (error) {
    throwHTTPError(StatusEnum.Server, res, basicError, false, error)
  }
}
