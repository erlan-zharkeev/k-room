import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

import { ISignInWithProviderPayload, ISignInWithProviderResponse, StatusEnum } from 'common'

import { updateTokens } from 'features/auth'
import { MESSAGE } from 'features/auth/sign-in-with-provider'
import { createUser, mapUserToDto } from 'features/user'
import { updateUserAvatar } from 'features/user/update-user-data'

import { UserModel } from 'entities/user'

import { AppResponseType, type IAppRequest, SHARED_MESSAGE } from 'shared-config'
import { getLocalizedText, throwHTTPError } from 'shared-lib'

export const signInWithProvider = async (req: IAppRequest, res: AppResponseType<ISignInWithProviderResponse>) => {
  const language = req.language

  try {
    const data: ISignInWithProviderPayload = req.body
    const { username, email, provider, avatar } = data

    const hashedPassword = await bcrypt.hash(uuidv4(), 6)
    const newUser = await createUser({ username, email, provider, hashedPassword })
    const user = newUser ?? await UserModel.findOne({ 'personal.email': email })

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

    if (!user) return throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(MESSAGE.failed, language))

    await updateTokens(user.id, req, res)

    return res.json({
      payload: mapUserToDto(user),
      message: {
        text: getLocalizedText(SHARED_MESSAGE.success, language),
        silent: true
      }
    })
  } catch {
    throwHTTPError(StatusEnum.BadRequest, res, getLocalizedText(MESSAGE.failed, language))
  }
}
