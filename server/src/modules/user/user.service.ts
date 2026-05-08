import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'
import {
  type AppLanguageType,
  type IEventStatusContact,
  type IChangePasswordPayload,
  type IFrontendContact,
  type IFrontendUserData,
  type InteractionType,
  normalizeNicknameKey,
  type ProviderType,
  REQ_STATUS,
  type ICreateNewPasswordPayload,
  VALIDATION_PATTERNS,
  type SocketActionsType
} from 'global-shared'
import { Types } from 'mongoose'

import { AppError } from 'src/shared/lib/app-error'
import { getIO } from 'src/shared/lib/io'
import { localizedText } from 'src/shared/lib/localized-text'
import type { MongoIdType } from 'src/shared/types/mongo'

import { isCodeExpired } from '../codes/codes.constants'
import { CodeModel } from '../codes/codes.model'
import { deleteBucketFilesByName, uploadBufferToBucket } from '../media/media.service'

import type { IContact, IUserExistState, IUserSchema } from './types'
import { ALLOWED_GOOGLE_AVATAR_HOSTS } from './user.constants'
import { CHANGE_PASSWORD_I18N, RESET_PASSWORD_I18N, UPDATE_USER_DATA_I18N, USER_I18N } from './user.i18n'
import { UserModel } from './user.model'

export const mapUserToDto = (user: IUserSchema): IFrontendUserData => {
  return {
    id: String(user._id),
    role: user.system.role,
    email: user.personal.email,
    nickname: user.public.nickname
  }
}

export const transformUserToContact = (
  user: IUserSchema,
  interactionType: InteractionType = 'default'
): IFrontendContact => {
  return {
    id: String(user._id),
    nickname: user.public.nickname,
    interactionType,
    online: user.public.online,
    lastSeen: user.public.lastSeen
  }
}

export const transformUserToFrontendContact = async (
  contacts: Record<string, IContact>
): Promise<IFrontendContact[]> => {
  const result: IFrontendContact[] = []

  for (const [id, data] of Object.entries(contacts)) {
    const user = await UserModel.findById(id).lean<IUserSchema | null>()

    if (user) {
      result.push(transformUserToContact(user, data.interaction))
    }
  }

  return result
}

export const getSocketsByUserIds = async (ids: MongoIdType[]) => {
  const users = await UserModel.find({ _id: { $in: ids } }, { _id: 1, 'system.device': 1 }).lean()

  return users.flatMap((user) => {
    return Object.values(user.system.device ?? {})
      .map((device) => device.socketId)
      .filter((socketId): socketId is string => Boolean(socketId))
  })
}

export const emitUserStatusToAll = async (interlocutorId: string, online: boolean, lastSeen?: number) => {
  const users = await UserModel.find({ [`personal.contacts.${interlocutorId}`]: { $exists: true } }, { _id: 1 }).lean()

  if (!users.length) {
    return
  }

  const sockets = await getSocketsByUserIds(users.map((user) => user._id))
  const payload: IEventStatusContact = {
    interlocutorId,
    online,
    onlineStatusUpdatedTimestamp: Date.now(),
    lastSeen
  }

  sockets.forEach((socketId) => {
    getIO().to(socketId).emit<SocketActionsType>('contact-status-updated', payload)
  })
}

export const setUserStatus = async (userId: string, status: boolean, lastSeen?: number) => {
  await UserModel.updateOne({ _id: userId }, { $set: { 'public.online': status } })
  await emitUserStatusToAll(userId, status, lastSeen)
}

export const setLastSeenData = async (userId: string) => {
  const lastSeen = Date.now()
  await UserModel.updateOne({ _id: userId }, { $set: { 'public.lastSeen': lastSeen } })

  return lastSeen
}

export const isUserExist = async ({
  nickname,
  email,
  id
}: {
  nickname: string
  email: string
  id?: Types.ObjectId
}): Promise<IUserExistState> => {
  const normalizedNickname = normalizeNicknameKey(nickname)
  const userByNickname = await UserModel.findOne({ 'public.nickname': normalizedNickname })

  if (userByNickname) {
    return {
      exists: true,
      reason: 'nickname'
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

export const createUser = async ({
  id,
  email,
  nickname,
  hashedPassword,
  provider = 'app'
}: {
  id?: Types.ObjectId
  email: string
  nickname: string
  hashedPassword: string
  provider?: ProviderType
}) => {
  const normalizedNickname = normalizeNicknameKey(nickname)
  const userExistState = await isUserExist({ id, nickname: normalizedNickname, email })

  if (userExistState.exists) {
    return null
  }

  const user = await new UserModel({
    ...(id ? { _id: id } : {}),
    public: {
      nickname: normalizedNickname
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

  return user
}

export const loadGoogleAvatar = async (avatar: string) => {
  try {
    const avatarUrl = new URL(avatar)

    if (!ALLOWED_GOOGLE_AVATAR_HOSTS.includes(avatarUrl.hostname)) {
      return
    }

    const response = await fetch(avatar)

    return Buffer.from(await response.arrayBuffer())
  } catch {
    return undefined
  }
}

export const updateUserAvatar = async (buffer: Buffer | null, userId: string, language: AppLanguageType) => {
  const filename = `avatar.${userId}`

  if (buffer === null) {
    await deleteBucketFilesByName('avatar', filename, language)
    return
  }

  await uploadBufferToBucket(buffer, filename, 'avatar', language, {
    overwrite: true,
    compression: 'avatar'
  })
}

@Injectable()
export class UserService {
  mapUserToDto(user: IUserSchema): IFrontendUserData {
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

  async isUserExist({
    nickname,
    email,
    id
  }: {
    nickname: string
    email: string
    id?: Types.ObjectId
  }): Promise<IUserExistState> {
    return isUserExist({ nickname, email, id })
  }

  async createUser({
    id,
    email,
    nickname,
    hashedPassword,
    provider = 'app'
  }: {
    id?: Types.ObjectId
    email: string
    nickname: string
    hashedPassword: string
    provider?: ProviderType
  }) {
    return createUser({ id, email, nickname, hashedPassword, provider })
  }

  getUserExistMessage(reason: IUserExistState['reason'], language: AppLanguageType) {
    switch (reason) {
      case 'nickname':
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

  async resetPassword({ codeToValidate, password }: ICreateNewPasswordPayload, language: AppLanguageType) {
    const code = await CodeModel.findOne({ 'codes.passwordRecovery.query.value': codeToValidate })

    if (!code) {
      throw new AppError(REQ_STATUS.badRequest, localizedText(RESET_PASSWORD_I18N.failed, language))
    }

    const { value, expiresAt } = code.codes.passwordRecovery.query

    if (isCodeExpired(expiresAt)) {
      throw new AppError(REQ_STATUS.badRequest, localizedText(RESET_PASSWORD_I18N.codeExpired, language))
    }

    if (value !== codeToValidate) {
      throw new AppError(REQ_STATUS.badRequest, localizedText(RESET_PASSWORD_I18N.codeNotValid, language))
    }

    const hashedPassword = await bcrypt.hash(password, 6)

    await UserModel.findOneAndUpdate({ _id: code._id }, { 'system.password': hashedPassword })
    await code.updateOne({
      $set: {
        'codes.passwordRecovery.query.value': '',
        'codes.passwordRecovery.query.expiresAt': 0,
        'codes.passwordRecovery.email.value': '',
        'codes.passwordRecovery.email.expiresAt': 0,
        nextRequestPossibleAt: null
      }
    })
  }

  async changePassword({
    userId,
    currentPassword,
    password,
    language
  }: IChangePasswordPayload & { userId: string; language: AppLanguageType }) {
    const user = await this.requireUser(userId, language)
    const passwordIsValid = await bcrypt.compare(currentPassword, user.system.password)

    if (!passwordIsValid) {
      throw new AppError(REQ_STATUS.badRequest, localizedText(CHANGE_PASSWORD_I18N.currentPasswordInvalid, language))
    }

    const hashedPassword = await bcrypt.hash(password, 6)

    await user.updateOne({ $set: { 'system.password': hashedPassword } })
  }

  async changeEmail({ userId, email, language }: { userId: string; email: string; language: AppLanguageType }) {
    const user = await this.requireUser(userId, language)
    const normalizedEmail = email.trim()

    if (normalizedEmail === user.personal.email) {
      return
    }

    const userWithSameEmail = await UserModel.findOne({
      _id: { $ne: userId },
      'personal.email': normalizedEmail
    }).lean()

    if (userWithSameEmail) {
      throw new AppError(REQ_STATUS.badRequest, this.getUserExistMessage('email', language))
    }

    await user.updateOne({ $set: { 'personal.email': normalizedEmail, 'system.confirmed': true } })
  }

  async updateUserData({
    userId,
    nickname,
    avatarFileBuffer,
    resetAvatar,
    language
  }: {
    userId: string
    nickname?: string
    avatarFileBuffer?: Buffer
    resetAvatar?: 'reset' | ''
    language: AppLanguageType
  }) {
    if (!nickname && !avatarFileBuffer && resetAvatar !== 'reset') {
      throw new AppError(REQ_STATUS.badRequest, localizedText(UPDATE_USER_DATA_I18N.nothingToUpdate, language))
    }

    const user = await this.requireUser(userId, language)
    const normalizedNickname = nickname ? normalizeNicknameKey(nickname) : ''

    if (normalizedNickname && normalizedNickname !== user.public.nickname) {
      const userWithSameNickname = await UserModel.findOne({
        _id: { $ne: userId },
        'public.nickname': normalizedNickname
      }).lean()

      if (userWithSameNickname) {
        throw new AppError(REQ_STATUS.badRequest, this.getUserExistMessage('nickname', language))
      }

      await user.updateOne({ $set: { 'public.nickname': normalizedNickname } })
    }

    if (avatarFileBuffer) {
      await updateUserAvatar(avatarFileBuffer, userId, language)
    }

    if (resetAvatar === 'reset') {
      await updateUserAvatar(null, userId, language)
    }

    const contacts = await UserModel.find({ [`personal.contacts.${userId}`]: { $exists: true } }, { _id: 1 }).lean()
    const ids = contacts.map((contact) => String(contact._id))

    if (!ids.length) {
      return
    }

    const updatedUserData = await UserModel.findById(userId).lean<IUserSchema | null>()

    if (!updatedUserData) {
      return
    }

    const sockets = await getSocketsByUserIds(ids)

    sockets.forEach((socketId) => {
      getIO().to(socketId).emit<SocketActionsType>('contact-data-changed', transformUserToContact(updatedUserData))
    })
  }
}
