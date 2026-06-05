import {
  CONTACT_INTERACTION,
  type Interaction,
  isAcceptedContactInteraction,
  normalizeNicknameKey
} from 'global-shared'

import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import { UserModel } from '../user.model'

export const findUserById = (userId: string) => {
  return UserModel.findById(userId)
}

export const findUserByEmail = (email: string) => {
  return UserModel.findOne({ 'personal.email': email.trim() })
}

export const findUserByNickname = (nickname: string) => {
  return UserModel.findOne({ 'public.nickname': normalizeNicknameKey(nickname) })
}

export const loadUserById = (userId: string) => {
  return UserModel.findById(userId).lean()
}

export const loadUserChatRoomIds = (userId: string) => {
  return UserModel.findById(userId, { 'personal.chatRooms': 1 }).lean()
}

export const loadUserPublicById = (userId: string) => {
  return UserModel.findById(userId, { 'public.avatarId': 1, 'public.nickname': 1, 'public.lastSeen': 1 }).lean()
}

export const loadUserPublicNicknameById = (userId: string) => {
  return UserModel.findById(userId).select('public.nickname').lean()
}

export const loadUsersPublicByIds = (userIds: string[]) => {
  return UserModel.find(
    { _id: { $in: userIds } },
    { 'public.avatarId': 1, 'public.nickname': 1, 'public.lastSeen': 1 }
  ).lean()
}

export const confirmUserEmailIfNeeded = async (userId: string) => {
  const updateResult = await UserModel.updateOne(
    { _id: userId, 'system.confirmed': { $ne: true } },
    { $set: { 'system.confirmed': true } }
  )

  return updateResult.modifiedCount === 1
}

export const hasUserRefreshDevice = async (userId: string, deviceId: string, refreshToken: string) => {
  const user = await UserModel.findOne({
    _id: userId,
    [`system.device.${deviceId}.refreshToken`]: refreshToken
  })
    .select('_id')
    .lean()

  return Boolean(user)
}

export const setUserRefreshDevice = async (userId: string, deviceId: string, refreshToken: string) => {
  await UserModel.updateOne(
    { _id: userId },
    {
      $set: {
        [`system.device.${deviceId}`]: {
          refreshToken
        }
      }
    }
  )
}

export const clearUserRefreshDevice = async (userId: string, deviceId: string) => {
  await UserModel.updateOne(
    { _id: userId },
    {
      $unset: {
        [`system.device.${deviceId}`]: ''
      }
    }
  )
}

export const updateUserLastSeen = (userId: string, lastSeen: number) => {
  return UserModel.updateOne({ _id: userId }, { $set: { 'public.lastSeen': lastSeen } })
}

export const checkUsersAcceptedContacts = async (selfId: string, contactIds: string[]) => {
  const [self, contacts] = await Promise.all([
    UserModel.findById(selfId, { 'personal.contacts': 1 }),
    UserModel.find({ _id: { $in: contactIds } }, { 'personal.contacts': 1 })
  ])

  if (!self || contacts.length !== contactIds.length) {
    return false
  }

  const contactById = new Map(contacts.map((contact) => [stringifyMongoId(contact._id), contact]))

  return contactIds.every((contactId) => {
    const selfContact = self.personal.contacts[contactId]
    const user = contactById.get(contactId)

    if (!user) return false

    const userContact = user.personal.contacts[selfId]
    const isSelfContactAccepted = isAcceptedContactInteraction(selfContact?.interaction)
    const isUserContactAccepted = isAcceptedContactInteraction(userContact?.interaction)

    return isSelfContactAccepted && isUserContactAccepted
  })
}

export const addChatRoomToUsers = async (roomId: string, userIds: string[]) => {
  await Promise.all(
    userIds.map(async (userId) => {
      await UserModel.updateOne({ _id: userId }, { $push: { 'personal.chatRooms': roomId } })
    })
  )
}

export const addChatRoomToUsersByIds = (roomId: string, userIds: string[]) => {
  return UserModel.updateMany({ _id: { $in: userIds } }, { $push: { 'personal.chatRooms': roomId } })
}

export const removeChatRoomFromUsersByIds = (roomId: string, userIds: string[]) => {
  return UserModel.updateMany(
    { _id: { $in: userIds } },
    {
      $pull: {
        'personal.chatRooms': roomId,
        'personal.pinnedChatRoomIds': roomId,
        'personal.mutedChatRoomIds': roomId
      }
    }
  )
}

export const removeChatRoomFromUser = (roomId: string, userId: string) => {
  return UserModel.updateOne(
    { _id: userId },
    {
      $pull: {
        'personal.chatRooms': roomId,
        'personal.pinnedChatRoomIds': roomId,
        'personal.mutedChatRoomIds': roomId
      }
    }
  )
}

export const loadUserPinnedChatRoomsForRoom = (userId: string, roomId: string) => {
  return UserModel.findOne({ _id: userId, 'personal.chatRooms': roomId }, { 'personal.pinnedChatRoomIds': 1 }).lean()
}

export const loadUserMutedChatRoomsForRoom = (userId: string, roomId: string) => {
  return UserModel.findOne({ _id: userId, 'personal.chatRooms': roomId }, { 'personal.mutedChatRoomIds': 1 }).lean()
}

export const loadUserPinnedChatRooms = (userId: string) => {
  return UserModel.findById(userId, { 'personal.pinnedChatRoomIds': 1 }).lean()
}

export const setUserPinnedChatRoomIds = (userId: string, pinnedChatRoomIds: string[]) => {
  return UserModel.updateOne({ _id: userId }, { $set: { 'personal.pinnedChatRoomIds': pinnedChatRoomIds } })
}

export const setUserMutedChatRoomIds = (userId: string, mutedChatRoomIds: string[]) => {
  return UserModel.updateOne({ _id: userId }, { $set: { 'personal.mutedChatRoomIds': mutedChatRoomIds } })
}

export const loadUserRoomPreferences = (userId: string) => {
  return UserModel.findById(userId).lean()
}

export const loadUsersChatRoomsByIds = (userIds: string[]) => {
  return UserModel.find({ _id: { $in: userIds } }, { 'personal.chatRooms': 1 }).lean()
}

export const loadUsersHavingContact = (userId: string) => {
  return UserModel.find({ [`personal.contacts.${userId}`]: { $exists: true } }, { _id: 1 }).lean()
}

export const loadContactSearchUsersById = (id: string) => {
  return UserModel.find({ _id: id }).sort({ 'public.nickname': 1 }).lean()
}

export const loadContactSearchUsersByNickname = (nickname: string) => {
  return UserModel.find({ 'public.nickname': { $regex: new RegExp(nickname, 'i') } })
    .sort({ 'public.nickname': 1 })
    .lean()
}

export const loadUserContactsById = (userId: string) => {
  return UserModel.findById(userId, { 'personal.contacts': 1 }).lean()
}

export const setDefaultUserContact = (userId: string, contactId: string) => {
  return UserModel.updateOne(
    { _id: userId },
    {
      $set: {
        [`personal.contacts.${contactId}`]: {
          id: contactId,
          interaction: CONTACT_INTERACTION.DEFAULT,
          updatedAt: Date.now()
        }
      }
    }
  )
}

export const createUserContactInteraction = async (userId: string, contactId: string, interaction: Interaction) => {
  const user = await loadUserContactsById(userId)

  if (!user) {
    return null
  }

  return UserModel.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        [`personal.contacts.${contactId}`]: {
          id: contactId,
          interaction,
          updatedAt: Date.now()
        }
      }
    },
    { new: true }
  )
}

export const setExistingUserContactInteraction = (userId: string, contactId: string, interaction: Interaction) => {
  return UserModel.findOneAndUpdate(
    { _id: userId, [`personal.contacts.${contactId}`]: { $exists: true } },
    {
      $set: {
        [`personal.contacts.${contactId}.interaction`]: interaction,
        updatedAt: Date.now()
      }
    },
    { new: true }
  )
}

export const loadUserContactInteraction = async (userId: string, contactId: string) => {
  const user = await UserModel.findOne({ _id: userId }, { [`personal.contacts.${contactId}.interaction`]: 1 }).lean()

  return user?.personal.contacts[contactId]?.interaction
}

export const deleteUserContact = (userId: string, contactId: string) => {
  return UserModel.updateOne({ _id: userId }, { $unset: { [`personal.contacts.${contactId}`]: '' } })
}

export const loadUserContactInteractionDocument = (userId: string, contactId: string) => {
  return UserModel.findOne({ _id: userId }, { [`personal.contacts.${contactId}.interaction`]: 1 })
}
