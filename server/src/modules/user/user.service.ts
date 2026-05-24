import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'
import {
  CONTACT_INTERACTION,
  type Contact,
  type CreateNewPasswordPayload,
  type Interaction,
  type MediaId,
  type UserData,
  MEDIA_AVATAR_VALIDATION_OPTIONS,
  VALIDATION_PATTERNS,
  getRoomOtherUserIds,
  normalizeNicknameKey,
  REQ_STATUS
} from 'global-shared'
import uniq from 'lodash/uniq'

import { AppError } from 'src/shared/lib/app-error'

import { ChatRoomModel } from '../chat-rooms/chat-rooms.model'
import { isCodeExpired } from '../codes/codes.constants'
import { CodeModel } from '../codes/codes.model'
import { deleteBucketFileById, uploadBufferToBucket, withUploadedMediaCleanup } from '../media/media.service'
import type { PresenceService } from '../presence/presence.service'
import { emitToUsers } from '../presence/presence.utils'

import type {
  ChangeEmailParams,
  ChangePasswordParams,
  UserContact,
  CreateUserParams,
  UpdateUserDataParams,
  UserExistParams,
  UserExistState,
  UserSchema
} from './types'
import { ALLOWED_GOOGLE_AVATAR_HOSTS } from './user.constants'
import { CHANGE_PASSWORD_I18N, RESET_PASSWORD_I18N, UPDATE_USER_DATA_I18N, USER_I18N } from './user.i18n'
import { UserModel } from './user.model'

export const transformUserToPreview = (user: UserSchema) => {
  const userId = String(user._id)

  return {
    avatarId: user.public.avatarId,
    id: userId,
    nickname: user.public.nickname
  }
}

export const mapUserToDto = (user: UserSchema): UserData => {
  return {
    ...transformUserToPreview(user),
    role: user.system.role,
    email: user.personal.email
  }
}

export const transformUserToContact = (
  user: UserSchema,
  interactionType: Interaction = CONTACT_INTERACTION.DEFAULT,
  online = false
): Contact => {
  return {
    ...transformUserToPreview(user),
    interactionType,
    online,
    lastSeen: user.public.lastSeen
  }
}

export const transformUserToFrontendContact = async (
  contacts: Record<string, UserContact>,
  presenceService: PresenceService
): Promise<Contact[]> => {
  const ids = Object.keys(contacts)
  const [users, onlineMap] = await Promise.all([
    UserModel.find({ _id: { $in: ids } }).lean<UserSchema[]>(),
    presenceService.onlineMapByUserIds(ids)
  ])

  return users.map((user) => {
    const userId = String(user._id)
    const interactionType = contacts[userId]?.interaction ?? CONTACT_INTERACTION.DEFAULT

    return transformUserToContact(user, interactionType, onlineMap.get(userId) ?? false)
  })
}

export const isUserExist = async ({ nickname, email, id }: UserExistParams): Promise<UserExistState> => {
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

export const createUser = async ({ id, email, nickname, hashedPassword, provider = 'app' }: CreateUserParams) => {
  const normalizedNickname = normalizeNicknameKey(nickname)
  const userExistState = await isUserExist({ id, nickname: normalizedNickname, email })

  if (userExistState.exists) {
    return null
  }

  const user = await new UserModel({
    ...(id ? { _id: id } : {}),
    public: {
      avatarId: null,
      nickname: normalizedNickname
    },
    personal: {
      email,
      contacts: {},
      chatRooms: [],
      pinnedChatRoomIds: [],
      mutedChatRoomIds: []
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

export function updateUserAvatar(buffer: Buffer, currentAvatarId: MediaId): Promise<string>
export function updateUserAvatar(buffer: null, currentAvatarId: MediaId): Promise<null>
export async function updateUserAvatar(buffer: Buffer | null, currentAvatarId: MediaId) {
  if (buffer === null) {
    if (currentAvatarId) {
      await deleteBucketFileById('image', currentAvatarId)
    }

    return null
  }

  return uploadBufferToBucket(buffer, 'image', {
    compression: 'avatar',
    validation: MEDIA_AVATAR_VALIDATION_OPTIONS
  })
}

@Injectable()
export class UserService {
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

  async changePassword({ userId, currentPassword, password }: ChangePasswordParams) {
    const user = await this.requireUser(userId)
    const passwordIsValid = await bcrypt.compare(currentPassword, user.system.password)

    if (!passwordIsValid) {
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

    const [contacts, rooms] = await Promise.all([
      UserModel.find({ [`personal.contacts.${userId}`]: { $exists: true } }, { _id: 1 }).lean(),
      ChatRoomModel.find({ users: userId }, { users: 1 }).lean()
    ])

    const ids = uniq([
      ...contacts.map((contact) => String(contact._id)),
      ...rooms.flatMap((room) => getRoomOtherUserIds(room, userId))
    ])
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
