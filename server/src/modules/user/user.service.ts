import { Injectable } from '@nestjs/common'
import { Types } from 'mongoose'
import { type AppLanguageType, type IFrontendUserData, type ProviderType, REQ_STATUS } from 'shared'

import { AppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'

import type { IUserExistState, IUserSchema } from './types'
import { USER_I18N } from './user.i18n'
import { UserModel } from './user.model'

@Injectable()
export class UserService {
  mapUserToDto(user: IUserSchema): IFrontendUserData {
    return {
      id: String(user._id),
      role: user.system.role,
      email: user.personal.email,
      username: user.public.username
    }
  }

  async findById(userId: string) {
    return UserModel.findById(userId)
  }

  async findByEmail(email: string) {
    return UserModel.findOne({ 'personal.email': email })
  }

  async isUserExist({
    username,
    email,
    id
  }: {
    username: string
    email: string
    id?: Types.ObjectId
  }): Promise<IUserExistState> {
    const userByName = await UserModel.findOne({ 'public.username': username })
    if (userByName) {
      return {
        exists: true,
        reason: 'username'
      }
    }

    const userByEmail = await UserModel.findOne({ 'personal.email': email })
    if (userByEmail) {
      return {
        exists: true,
        reason: 'email'
      }
    }

    if (id) {
      const userById = await UserModel.findById(id)
      if (userById) {
        return {
          exists: true,
          reason: 'id'
        }
      }
    }

    return {
      exists: false,
      reason: null
    }
  }

  async createUser({
    email,
    username,
    hashedPassword,
    provider = 'app'
  }: {
    email: string
    username: string
    hashedPassword: string
    provider?: ProviderType
  }) {
    const userExistState = await this.isUserExist({ username, email })
    if (userExistState.exists) {
      return null
    }

    return new UserModel({
      public: {
        username
      },
      personal: {
        email,
        contacts: {},
        chatRooms: []
      },
      system: {
        role: 'user',
        password: hashedPassword,
        provider,
        device: {},
        confirmed: provider !== 'app',
        confirmAttempts: 3
      }
    }).save()
  }

  getUserExistMessage(reason: IUserExistState['reason'], language: AppLanguageType) {
    switch (reason) {
      case 'username':
        return localizedText(USER_I18N.userWithCurrentNameAlreadyExist, language)
      case 'email':
        return localizedText(USER_I18N.userWithCurrentEmailAlreadyExist, language)
      case 'id':
        return localizedText(USER_I18N.userWithCurrentIdAlreadyExist, language)
      default:
        return localizedText(USER_I18N.userNotFound, language)
    }
  }

  async requireUser(userId: string, language: AppLanguageType) {
    const user = await this.findById(userId)

    if (!user) {
      throw new AppError(REQ_STATUS.badRequest, localizedText(USER_I18N.userNotFound, language))
    }

    return user
  }
}
