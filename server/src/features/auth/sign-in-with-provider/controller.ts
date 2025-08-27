import bcrypt from 'bcryptjs'
import { ISignInWithProviderPayload, ISignInWithProviderResponse, StatusEnum } from 'common-types'
import { createUser, mapUserToDto } from 'features/user'
import { AppResponseType, type IAppRequest, SHARED_MESSAGE } from 'shared-config'
import { throwHTTPError } from 'shared-lib'
import { v4 as uuidv4 } from 'uuid'

import { updateTokens } from '../~shared'
import { MESSAGE } from './config'

export const signInWithProvider = async (req: IAppRequest, res: AppResponseType<ISignInWithProviderResponse>) => {
  try {
    const data: ISignInWithProviderPayload = req.body
    const { username, email, provider } = data

    const hashedPassword = await bcrypt.hash(uuidv4(), 6)
    const user = await createUser({ username, email, provider, hashedPassword })

    if (!user) return

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
