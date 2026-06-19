import { normalizeNicknameKey } from 'global-shared'

import { UserModel } from '../user.model'
import type { CreateUserParams, UserExistParams, UserExistState } from '../user.types'

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

  return new UserModel({
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
}
