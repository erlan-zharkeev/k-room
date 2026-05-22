import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'
import {
  type ContactType,
  type UserDataType,
  type InteractionType,
  normalizeNicknameKey,
  REQ_STATUS,
  type ICreateNewPasswordPayload,
  MEDIA_AVATAR_FILENAME_PREFIX,
  VALIDATION_PATTERNS
} from 'global-shared'

import { AppError } from 'src/shared/lib/app-error'

import { ChatRoomModel } from '../chat-rooms/chat-rooms.model'
import { isCodeExpired } from '../codes/codes.constants'
import { CodeModel } from '../codes/codes.model'
import { deleteBucketFilesByName, uploadBufferToBucket } from '../media/media.service'
import type { PresenceService } from '../presence/presence.service'
import { emitToUsers } from '../presence/presence.utils'

import type {
  IChangeEmailParams,
  IChangePasswordParams,
  IContact,
  ICreateUserParams,
  IUpdateUserDataParams,
  IUserExistParams,
  IUserExistState,
  IUserSchema
} from './types'
import { ALLOWED_GOOGLE_AVATAR_HOSTS } from './user.constants'
import { CHANGE_PASSWORD_I18N, RESET_PASSWORD_I18N, UPDATE_USER_DATA_I18N, USER_I18N } from './user.i18n'
import { UserModel } from './user.model'

export const mapUserToDto = (user: IUserSchema): UserDataType => {
  return {
    id: String(user._id),
    role: user.system.role,
    email: user.personal.email,
    nickname: user.public.nickname
  }
}

export const transformUserToContact = (
  user: IUserSchema,
  interactionType: InteractionType = 'default',
  online = false
): ContactType => {
  return {
    id: String(user._id),
    nickname: user.public.nickname,
    interactionType,
    online,
    lastSeen: user.public.lastSeen
  }
}

export const transformUserToFrontendContact = async (
  contacts: Record<string, IContact>,
  presenceService: PresenceService
): Promise<ContactType[]> => {
  const ids = Object.keys(contacts)
  const [users, onlineMap] = await Promise.all([
    UserModel.find({ _id: { $in: ids } }).lean<IUserSchema[]>(),
    presenceService.onlineMapByUserIds(ids)
  ])

  return users.map((user) => {
    const userId = String(user._id)
    const interactionType = contacts[userId]?.interaction ?? 'default'

    return transformUserToContact(user, interactionType, onlineMap.get(userId) ?? false)
  })
}

export const isUserExist = async ({ nickname, email, id }: IUserExistParams): Promise<IUserExistState> => {
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

export const createUser = async ({ id, email, nickname, hashedPassword, provider = 'app' }: ICreateUserParams) => {
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
      chatRooms: [],
      pinnedChatRoomIds: []
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

export const updateUserAvatar = async (buffer: Buffer | null, userId: string) => {
  const filename = `${MEDIA_AVATAR_FILENAME_PREFIX}${userId}`

  if (buffer === null) {
    await deleteBucketFilesByName('avatar', filename)
    return
  }

  await uploadBufferToBucket(buffer, filename, 'avatar', {
    overwrite: true,
    compression: 'avatar'
  })
}

@Injectable()
export class UserService {
  mapUserToDto(user: IUserSchema): UserDataType {
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

  async isUserExist({ nickname, email, id }: IUserExistParams): Promise<IUserExistState> {
    return isUserExist({ nickname, email, id })
  }

  async createUser({ id, email, nickname, hashedPassword, provider = 'app' }: ICreateUserParams) {
    return createUser({ id, email, nickname, hashedPassword, provider })
  }

  getUserExistMessage(reason: IUserExistState['reason']) {
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

  async resetPassword({ codeToValidate, password }: ICreateNewPasswordPayload) {
    const code = await CodeModel.findOne({ 'codes.passwordRecovery.query.value': codeToValidate })

    if (!code) {
      throw new AppError(REQ_STATUS.badRequest, RESET_PASSWORD_I18N.failed)
    }

    const { value, expiresAt } = code.codes.passwordRecovery.query

    if (isCodeExpired(expiresAt)) {
      throw new AppError(REQ_STATUS.badRequest, RESET_PASSWORD_I18N.codeExpired)
    }

    if (value !== codeToValidate) {
      throw new AppError(REQ_STATUS.badRequest, RESET_PASSWORD_I18N.codeNotValid)
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

  async changePassword({ userId, currentPassword, password }: IChangePasswordParams) {
    const user = await this.requireUser(userId)
    const passwordIsValid = await bcrypt.compare(currentPassword, user.system.password)

    if (!passwordIsValid) {
      throw new AppError(REQ_STATUS.badRequest, CHANGE_PASSWORD_I18N.currentPasswordInvalid)
    }

    const hashedPassword = await bcrypt.hash(password, 6)

    await user.updateOne({ $set: { 'system.password': hashedPassword } })
  }

  async changeEmail({ userId, email }: IChangeEmailParams) {
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

  async updateUserData({ userId, nickname, avatarFileBuffer, resetAvatar }: IUpdateUserDataParams) {
    if (!nickname && !avatarFileBuffer && resetAvatar !== 'reset') {
      throw new AppError(REQ_STATUS.badRequest, UPDATE_USER_DATA_I18N.nothingToUpdate)
    }

    const user = await this.requireUser(userId)
    const normalizedNickname = nickname ? normalizeNicknameKey(nickname) : ''

    if (normalizedNickname && normalizedNickname !== user.public.nickname) {
      const userWithSameNickname = await UserModel.findOne({
        _id: { $ne: userId },
        'public.nickname': normalizedNickname
      }).lean()

      if (userWithSameNickname) {
        throw new AppError(REQ_STATUS.badRequest, this.getUserExistMessage('nickname'))
      }

      await user.updateOne({ $set: { 'public.nickname': normalizedNickname } })
    }

    if (avatarFileBuffer) {
      await updateUserAvatar(avatarFileBuffer, userId)
    }

    if (resetAvatar === 'reset') {
      await updateUserAvatar(null, userId)
    }

    const [contacts, rooms] = await Promise.all([
      UserModel.find({ [`personal.contacts.${userId}`]: { $exists: true } }, { _id: 1 }).lean(),
      ChatRoomModel.find({ users: userId }, { users: 1 }).lean()
    ])

    const ids = [
      ...new Set([
        ...contacts.map((contact) => String(contact._id)),
        ...rooms.flatMap((room) => room.users.map(String)).filter((id) => id !== userId)
      ])
    ]

    if (!ids.length) {
      return
    }

    const updatedUserData = await UserModel.findById(userId).lean<IUserSchema | null>()

    if (!updatedUserData) {
      return
    }

    emitToUsers(ids, 'contact-data-changed', {
      id: String(updatedUserData._id),
      nickname: updatedUserData.public.nickname
    })
  }
}
