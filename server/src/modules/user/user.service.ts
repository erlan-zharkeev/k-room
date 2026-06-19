import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'
import {
  type CreateNewPasswordPayload,
  type MediaId,
  type UserData,
  VALIDATION_PATTERNS,
  isBoolean,
  normalizeNicknameKey,
  REQ_STATUS
} from 'global-shared'

import { AppError } from 'src/shared/lib/app-error'

import { deleteBucketFileById, withUploadedMediaCleanup } from '../media/media.service'
import { emitToUsers } from '../presence/presence.utils'
import { SecurityService } from '../security/security.service'

import { resolveUserRelatedRecipientIds } from './lib/resolve-user-recipient-ids'
import { mapUserToDto, transformUserToPreview } from './lib/transform-user'
import { updateUserAvatar } from './lib/update-user-avatar'
import { createUser, isUserExist } from './lib/user-existence'
import { CHANGE_PASSWORD_I18N, RESET_PASSWORD_I18N, UPDATE_USER_DATA_I18N, USER_I18N } from './user.i18n'
import { UserModel } from './user.model'
import type {
  ChangeEmailParams,
  ChangePasswordParams,
  CreateUserParams,
  UpdateUserDataParams,
  UpdateUserOnboardingParams,
  UserExistParams,
  UserExistState,
  UserSchema
} from './user.types'

@Injectable()
export class UserService {
  constructor(private readonly securityService: SecurityService) {}

  mapUserToDto(user: UserSchema): UserData {
    return mapUserToDto(user)
  }

  async findById(userId: string) {
    return UserModel.findById(userId)
  }

  async findByEmail(email: string) {
    return UserModel.findOne({ 'personal.email': email.trim() })
  }

  async findByNickname(nickname: string) {
    return UserModel.findOne({ 'public.nickname': normalizeNicknameKey(nickname) })
  }

  async findByLogin(login: string) {
    if (new RegExp(VALIDATION_PATTERNS.email).test(login.trim())) {
      return this.findByEmail(login)
    }

    return this.findByNickname(login)
  }

  async isUserExist({ nickname, email, id }: UserExistParams): Promise<UserExistState> {
    return isUserExist({ nickname, email, id })
  }

  async createUser({ id, email, nickname, hashedPassword, provider = 'app' }: CreateUserParams) {
    return createUser({ id, email, nickname, hashedPassword, provider })
  }

  getUserExistMessage(reason: UserExistState['reason']) {
    switch (reason) {
      case 'nickname':
        return USER_I18N.userWithCurrentNameAlreadyExist
      case 'email':
        return USER_I18N.userWithCurrentEmailAlreadyExist
      case 'id':
        return USER_I18N.userWithCurrentIdAlreadyExist
      default:
        return USER_I18N.userNotFound
    }
  }

  async requireUser(userId: string) {
    const user = await this.findById(userId)

    if (!user) {
      throw new AppError(REQ_STATUS.badRequest, USER_I18N.userNotFound)
    }

    return user
  }

  async resetPassword({ codeToValidate, password }: CreateNewPasswordPayload) {
    const userId = await this.securityService.getPasswordRecoveryQueryUserId(codeToValidate)

    if (!userId) {
      throw new AppError(REQ_STATUS.badRequest, RESET_PASSWORD_I18N.failed)
    }

    const hashedPassword = await bcrypt.hash(password, 6)

    await UserModel.findOneAndUpdate({ _id: userId }, { 'system.password': hashedPassword })
    await this.securityService.clearPasswordRecoveryState(userId)
  }

  async changePassword({ userId, currentPassword, password }: ChangePasswordParams) {
    const user = await this.requireUser(userId)
    const isPasswordValid = await bcrypt.compare(currentPassword, user.system.password)

    if (!isPasswordValid) {
      throw new AppError(REQ_STATUS.badRequest, CHANGE_PASSWORD_I18N.currentPasswordInvalid)
    }

    const hashedPassword = await bcrypt.hash(password, 6)

    await user.updateOne({ $set: { 'system.password': hashedPassword } })
  }

  async changeEmail({ userId, email }: ChangeEmailParams) {
    const user = await this.requireUser(userId)
    const normalizedEmail = email.trim()

    if (normalizedEmail === user.personal.email) {
      return
    }

    const userWithSameEmail = await UserModel.findOne({
      _id: { $ne: userId },
      'personal.email': normalizedEmail
    }).lean()

    if (userWithSameEmail) {
      throw new AppError(REQ_STATUS.badRequest, this.getUserExistMessage('email'))
    }

    await user.updateOne({ $set: { 'personal.email': normalizedEmail, 'system.confirmed': true } })
  }

  async updateUserOnboarding({ userId, welcomeCompleted, guideCompleted }: UpdateUserOnboardingParams) {
    const updatedOnboardingData: Partial<UserData['onboarding']> = {}

    if (isBoolean(welcomeCompleted)) {
      updatedOnboardingData.welcomeCompleted = welcomeCompleted
    }

    if (isBoolean(guideCompleted)) {
      updatedOnboardingData.guideCompleted = guideCompleted
    }

    if (!Object.keys(updatedOnboardingData).length) {
      throw new AppError(REQ_STATUS.badRequest, UPDATE_USER_DATA_I18N.nothingToUpdate)
    }

    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: Object.fromEntries(
          Object.entries(updatedOnboardingData).map(([key, value]) => [`personal.onboarding.${key}`, value])
        )
      },
      { new: true }
    )

    if (!user) {
      throw new AppError(REQ_STATUS.server, UPDATE_USER_DATA_I18N.failedUpdate)
    }

    return mapUserToDto(user)
  }

  async updateUserData({ userId, nickname, avatarFileBuffer, resetAvatar }: UpdateUserDataParams) {
    const shouldResetAvatar = resetAvatar === 'reset'

    if (!nickname && !avatarFileBuffer && !shouldResetAvatar) {
      throw new AppError(REQ_STATUS.badRequest, UPDATE_USER_DATA_I18N.nothingToUpdate)
    }

    const user = await this.requireUser(userId)
    const normalizedNickname = nickname ? normalizeNicknameKey(nickname) : ''
    let avatarIdAfterUpdate: MediaId | undefined
    const updatedPublicData: Partial<UserSchema['public']> = {}

    if (normalizedNickname && normalizedNickname !== user.public.nickname) {
      const userWithSameNickname = await UserModel.findOne({
        _id: { $ne: userId },
        'public.nickname': normalizedNickname
      }).lean()

      if (userWithSameNickname) {
        throw new AppError(REQ_STATUS.badRequest, this.getUserExistMessage('nickname'))
      }

      updatedPublicData.nickname = normalizedNickname
    }

    const updatedUserData = await withUploadedMediaCleanup(async (trackUploadedMedia) => {
      if (shouldResetAvatar) {
        avatarIdAfterUpdate = null
      }

      if (avatarFileBuffer && !shouldResetAvatar) {
        avatarIdAfterUpdate = await updateUserAvatar(avatarFileBuffer, user.public.avatarId)
        trackUploadedMedia('image', avatarIdAfterUpdate)
      }

      if (avatarIdAfterUpdate !== undefined) {
        updatedPublicData.avatarId = avatarIdAfterUpdate
      }

      if (Object.keys(updatedPublicData).length) {
        await user.updateOne({
          $set: Object.fromEntries(Object.entries(updatedPublicData).map(([key, value]) => [`public.${key}`, value]))
        })
      }

      const userData = await UserModel.findById(userId).lean<UserSchema | null>()

      if (!userData) {
        throw new AppError(REQ_STATUS.server, UPDATE_USER_DATA_I18N.failedUpdate)
      }

      return userData
    })

    const ids = await resolveUserRelatedRecipientIds(userId)
    const avatarWasChanged = avatarIdAfterUpdate !== undefined
    const deletedAvatarId =
      avatarWasChanged && user.public.avatarId !== avatarIdAfterUpdate ? user.public.avatarId : null

    if (deletedAvatarId) {
      await deleteBucketFileById('image', deletedAvatarId)
      emitToUsers([...ids, userId], 'media-files-deleted', { mediaIds: [deletedAvatarId] })
    }

    if (ids.length) {
      emitToUsers(ids, 'contact-data-changed', transformUserToPreview(updatedUserData))
    }

    return mapUserToDto(updatedUserData)
  }
}
