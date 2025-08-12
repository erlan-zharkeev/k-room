import bcrypt from 'bcryptjs'
import { ISignInWithProvider, SignInWithProviderPayloadType, StatusEnum } from 'common-types'
import { UserModel } from 'entities/user'
import { createUser, mapUserToDto } from 'features/user'
import { AppResponseType, type IAppRequest, SHARED_MESSAGE } from 'shared-config'
import { throwHTTPError } from 'shared-lib'
import { v4 as uuidv4 } from 'uuid'

import { updateTokens } from '../~shared'
import { MESSAGE } from './config'

export const signInWithProvider = async (req: IAppRequest, res: AppResponseType<ISignInWithProvider>) => {
  try {
    const data: SignInWithProviderPayloadType = req.body
    const { username, email, provider } = data
    const avatar = data.avatar ?? ''

    let user = await UserModel.findOne({ 'public.email': email })

    if (!user) {
      const hashedPassword = await bcrypt.hash(uuidv4(), 6)
      user = createUser({ username, email, avatar, provider, hashedPassword })
      await user.save()
    }

    await updateTokens(user.id, req, res)

    return res.json({
      data: mapUserToDto(user),
      message: {
        text: SHARED_MESSAGE.success,
        silent: true
      }
    })
  } catch {
    throwHTTPError(StatusEnum.BadRequest, res, MESSAGE.failed)
  }
}
