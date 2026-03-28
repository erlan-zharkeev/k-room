import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

import { ISignInWithProviderPayload, ISignInWithProviderResponse, StatusEnum } from 'common'

import { createUser, mapUserToDto, updateUserAvatar } from 'src/features/user'

import { UserModel } from 'src/entities/user'

import { AppResponseType, type IAppRequest, SHARED_MESSAGE } from 'src/shared/config'
import { getLocalizedText, throwHTTPError } from 'src/shared/lib'

import { updateTokens } from './../shared'
import { I18N_SIGN_IN_WITH_PROVIDER_MESSAGE } from '.'

export const signInWithProviderController = async (
  req: IAppRequest,
  res: AppResponseType<ISignInWithProviderResponse>
) => {
  const language = req.language

  try {
    const data: ISignInWithProviderPayload = req.body
    const { username, email, provider, avatar } = data

    const hashedPassword = await bcrypt.hash(uuidv4(), 6)
    const newUser = await createUser({ username, email, provider, hashedPassword })
    const user = newUser ?? (await UserModel.findOne({ 'personal.email': email }))

    if (newUser && avatar) {
      try {
        const avatarUrl = new URL(avatar)
        const allowedHosts = ['lh3.googleusercontent.com']
        if (allowedHosts.includes(avatarUrl.hostname)) {
          const response = await fetch(avatar)
          const buffer = Buffer.from(await response.arrayBuffer())
          await updateUserAvatar(buffer, String(newUser._id))
        }
      } catch {
        // non-critical, don't fail login
      }
    }

    if (!user)
      return throwHTTPError(
        StatusEnum.BadRequest,
        res,
        getLocalizedText(I18N_SIGN_IN_WITH_PROVIDER_MESSAGE.failed, language)
      )

    await updateTokens(user.id, req, res)

    return res.json({
      payload: mapUserToDto(user),
      message: {
        text: getLocalizedText(SHARED_MESSAGE.success, language),
        silent: true
      }
    })
  } catch {
    throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(I18N_SIGN_IN_WITH_PROVIDER_MESSAGE.failed, language))
  }
}
