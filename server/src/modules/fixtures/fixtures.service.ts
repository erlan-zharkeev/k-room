import fs from 'node:fs/promises'

import bcrypt from 'bcryptjs'
import { CHAT_KIND, MEDIA_AVATAR_VALIDATION_OPTIONS } from 'global-shared'
import countBy from 'lodash/countBy'
import { Types, type HydratedDocument } from 'mongoose'

import { ChatRoomModel } from 'src/modules/chat-rooms/chat-rooms.model'
import type { ChatRoomDocument, ChatRoomSchema } from 'src/modules/chat-rooms/chat-rooms.types'
import { uploadBufferToBucket } from 'src/modules/media/media.service'
import type { StreamMediaFileData } from 'src/modules/media/media.types'
import { MessageModel } from 'src/modules/messages/messages.model'
import { createUser, isUserExist } from 'src/modules/user/lib/user-existence'
import type { UserSchema } from 'src/modules/user/types'
import { UserModel } from 'src/modules/user/user.model'
import { log } from 'src/shared/lib/log'
import { stringifyMongoIds } from 'src/shared/lib/normalize-object-id'

import {
  DIRECT_FIXTURE_CONTACT_NICKNAME,
  DIRECT_FIXTURE_CONTACT_USER_ID,
  DIRECT_FIXTURE_CREATED_AT_OFFSET_MS,
  DIRECT_FIXTURE_MESSAGE_ID_PREFIX,
  DIRECT_FIXTURE_MESSAGES,
  FIXTURE_CONTACTS,
  FIXTURE_GROUPS,
  FIXTURE_MESSAGE_IMAGE_FILES,
  FIXTURE_USER_ONBOARDING,
  LEGACY_FIXTURE_EMPTY_ROOM_CHAT_NAME_PATTERN,
  LEGACY_FIXTURE_MESSAGE_ID_PATTERN,
  LEGACY_FIXTURE_ROOM_CHAT_NAMES,
  LEGACY_FIXTURE_USER_IDS,
  PRIMARY_FIXTURE_NICKNAME,
  PRIMARY_FIXTURE_USER_ID,
  PRODUCT_STUDIO_FIXTURE_CREATED_AT_OFFSET_MS,
  PRODUCT_STUDIO_FIXTURE_GROUP_KEY,
  PRODUCT_STUDIO_FIXTURE_MESSAGE_ID_PREFIX,
  PRODUCT_STUDIO_FIXTURE_MESSAGES,
  QUATERNARY_DIRECT_FIXTURE_CONTACT_NICKNAME,
  QUATERNARY_DIRECT_FIXTURE_CONTACT_USER_ID,
  QUATERNARY_DIRECT_FIXTURE_CREATED_AT_OFFSET_MS,
  QUATERNARY_DIRECT_FIXTURE_MESSAGE_ID_PREFIX,
  QUATERNARY_DIRECT_FIXTURE_MESSAGES,
  SECONDARY_DIRECT_FIXTURE_CONTACT_NICKNAME,
  SECONDARY_DIRECT_FIXTURE_CONTACT_USER_ID,
  SECONDARY_DIRECT_FIXTURE_CREATED_AT_OFFSET_MS,
  SECONDARY_DIRECT_FIXTURE_MESSAGE_ID_PREFIX,
  SECONDARY_DIRECT_FIXTURE_MESSAGES,
  TERTIARY_DIRECT_FIXTURE_CONTACT_NICKNAME,
  TERTIARY_DIRECT_FIXTURE_CONTACT_USER_ID,
  TERTIARY_DIRECT_FIXTURE_CREATED_AT_OFFSET_MS,
  TERTIARY_DIRECT_FIXTURE_MESSAGE_ID_PREFIX,
  TERTIARY_DIRECT_FIXTURE_MESSAGES,
  USER_FIXTURES,
  USER_BY_NICKNAME,
  WEEKEND_HOUSE_FIXTURE_CREATED_AT_OFFSET_MS,
  WEEKEND_HOUSE_FIXTURE_GROUP_KEY,
  WEEKEND_HOUSE_FIXTURE_MESSAGE_ID_PREFIX,
  WEEKEND_HOUSE_FIXTURE_MESSAGES
} from './fixtures.constants'
import type { FixtureContactData, FixtureUserData } from './fixtures.types'
import { buildFixtureMessageImageObject, buildFixtureMessages } from './lib/build-fixture-messages'
import { buildLegacyFixtureContactUnset } from './lib/build-legacy-fixture-contact-unset'
import { resolveFixtureImagePath } from './lib/resolve-fixture-image-path'

const ensureAvatarLoaded = async (user: HydratedDocument<UserSchema>, avatarId: string, avatarPath: string) => {
  const buffer = await fs.readFile(resolveFixtureImagePath(avatarPath))
  const loadedAvatarId = await uploadBufferToBucket(buffer, 'image', {
    id: avatarId,
    overwrite: true,
    compression: 'avatar',
    validation: MEDIA_AVATAR_VALIDATION_OPTIONS
  })

  user.public.avatarId = loadedAvatarId
  await user.save()

  return true
}

const ensureChatRoomAvatarLoaded = async (
  room: HydratedDocument<ChatRoomSchema>,
  avatarId: string,
  avatarPath: string
) => {
  const buffer = await fs.readFile(resolveFixtureImagePath(avatarPath))
  const loadedAvatarId = await uploadBufferToBucket(buffer, 'image', {
    id: avatarId,
    overwrite: true,
    compression: 'avatar',
    validation: MEDIA_AVATAR_VALIDATION_OPTIONS
  })

  room.avatarId = loadedAvatarId
  await room.save()

  return true
}

const loadUserFixture = async (data: FixtureUserData) => {
  const { id, nickname, email, pass, avatarId, avatarPath } = data
  const identifier = new Types.ObjectId(id)
  const userExistState = await isUserExist({ id: identifier, nickname, email })

  if (userExistState.exists) {
    const existingUser = await UserModel.findById(identifier)
    let wasUpdated = false

    if (existingUser) {
      if (existingUser.personal.email !== email) {
        existingUser.personal.email = email
        wasUpdated = true
      }

      if (existingUser.public.nickname !== nickname) {
        existingUser.public.nickname = nickname
        wasUpdated = true
      }

      if (!existingUser.system.confirmed) {
        existingUser.system.confirmed = true
        wasUpdated = true
      }

      const existingOnboarding = existingUser.personal.onboarding
      const hasFixtureWelcomeState = existingOnboarding?.welcomeCompleted === FIXTURE_USER_ONBOARDING.welcomeCompleted
      const hasFixtureGuideState = existingOnboarding?.guideCompleted === FIXTURE_USER_ONBOARDING.guideCompleted
      const shouldUpdateOnboarding = !hasFixtureWelcomeState || !hasFixtureGuideState

      if (shouldUpdateOnboarding) {
        existingUser.set('personal.onboarding', { ...FIXTURE_USER_ONBOARDING })
        wasUpdated = true
      }

      if (!(await bcrypt.compare(pass, existingUser.system.password))) {
        existingUser.system.password = await bcrypt.hash(pass, 6)
        wasUpdated = true
      }

      if (wasUpdated) {
        await existingUser.save()
      }

      const avatarLoaded = await ensureAvatarLoaded(existingUser, avatarId, avatarPath)

      return avatarLoaded || wasUpdated ? 'updated' : 'skipped'
    }

    return 'failed'
  }

  const hashedPassword = await bcrypt.hash(pass, 6)
  const user = await createUser({ id: identifier, email, nickname, hashedPassword })

  if (!user) {
    return 'failed'
  }

  user.public.nickname = nickname
  user.set('personal.onboarding', { ...FIXTURE_USER_ONBOARDING })
  await user.set('system.confirmed', true).save()
  await ensureAvatarLoaded(user, avatarId, avatarPath)

  return 'created'
}

const loadUserFixtures = async () => {
  const results = await Promise.all(USER_FIXTURES.map((data) => loadUserFixture(data)))
  const resultCount = countBy(results)
  const { created = 0, updated = 0, skipped = 0, failed = 0 } = resultCount

  log.info(`-User fixtures processed: created=${created}, updated=${updated}, skipped=${skipped}, failed=${failed}`)
}

const ensureUserPersonalChatRoomState = async () => {
  const [pinnedResult, mutedResult] = await Promise.all([
    UserModel.updateMany(
      { 'personal.pinnedChatRoomIds': { $exists: false } },
      { $set: { 'personal.pinnedChatRoomIds': [] } }
    ),
    UserModel.updateMany(
      { 'personal.mutedChatRoomIds': { $exists: false } },
      { $set: { 'personal.mutedChatRoomIds': [] } }
    )
  ])
  const updatedCount = pinnedResult.modifiedCount + mutedResult.modifiedCount

  if (!updatedCount) return

  log.info(`-User personal chat room state normalized: updated=${updatedCount}`)
}

const ensureUserPersonalContactsState = async () => {
  const result = await UserModel.updateMany(
    { 'personal.contacts': { $exists: false } },
    { $set: { 'personal.contacts': {} } }
  )

  if (!result.modifiedCount) return

  log.info(`-User personal contacts state normalized: updated=${result.modifiedCount}`)
}

const ensureChatRoomAvatarState = async () => {
  const result = await ChatRoomModel.updateMany({ avatarId: { $exists: false } }, { $set: { avatarId: null } })

  if (!result.modifiedCount) return

  log.info(`-Chat room avatar state normalized: updated=${result.modifiedCount}`)
}

const cleanupLegacyFixtureData = async () => {
  const legacyRooms = await ChatRoomModel.find({
    $or: [
      { chatName: { $in: LEGACY_FIXTURE_ROOM_CHAT_NAMES } },
      { chatName: LEGACY_FIXTURE_EMPTY_ROOM_CHAT_NAME_PATTERN },
      { users: { $in: LEGACY_FIXTURE_USER_IDS } }
    ]
  })
    .select('_id messages')
    .lean<Pick<ChatRoomDocument, '_id' | 'messages'>[]>()
  const legacyRoomIds = stringifyMongoIds(legacyRooms.map(({ _id }) => _id))
  const legacyRoomMessageIds = legacyRooms.flatMap(({ messages }) => stringifyMongoIds(messages))
  const [deletedUsers, deletedRooms, deletedMessages] = await Promise.all([
    UserModel.deleteMany({ _id: { $in: LEGACY_FIXTURE_USER_IDS } }),
    ChatRoomModel.deleteMany({ _id: { $in: legacyRoomIds } }),
    MessageModel.deleteMany({
      $or: [{ _id: LEGACY_FIXTURE_MESSAGE_ID_PATTERN }, { _id: { $in: legacyRoomMessageIds } }]
    }),
    ChatRoomModel.updateMany({}, { $pull: { messages: LEGACY_FIXTURE_MESSAGE_ID_PATTERN } }),
    UserModel.updateMany(
      {},
      {
        $pull: {
          'personal.chatRooms': { $in: legacyRoomIds },
          'personal.pinnedChatRoomIds': { $in: legacyRoomIds },
          'personal.mutedChatRoomIds': { $in: legacyRoomIds }
        },
        $unset: buildLegacyFixtureContactUnset()
      }
    )
  ])
  const deletedCount = deletedUsers.deletedCount + deletedRooms.deletedCount + deletedMessages.deletedCount

  if (!deletedCount) return

  log.info(`-Legacy fixtures cleaned: deleted=${deletedCount}`)
}

const ensureMessageImageLoaded = async (id: string, imagePath: string) => {
  const buffer = await fs.readFile(resolveFixtureImagePath(imagePath))

  await uploadBufferToBucket(buffer, 'image', {
    id,
    overwrite: true,
    compression: 'common-compressed'
  })

  return true
}

const ensureFixtureMessageImagesLoaded = async () => {
  await Promise.all(FIXTURE_MESSAGE_IMAGE_FILES.map((image) => ensureMessageImageLoaded(image.id, image.path)))
}

const loadFixtureMessageImageObjectById = async () => {
  const imageIds = FIXTURE_MESSAGE_IMAGE_FILES.map(({ id }) => new Types.ObjectId(id))
  const files = await UserModel.db
    .collection<StreamMediaFileData>('image.files')
    .find({ _id: { $in: imageIds } })
    .toArray()

  return new Map(files.map((file) => [String(file._id), buildFixtureMessageImageObject(String(file._id), file)]))
}

const setFixtureContact = async (userId: string, contactId: string, interaction: FixtureContactData['interaction']) => {
  await UserModel.updateOne(
    { _id: userId },
    {
      $set: {
        [`personal.contacts.${contactId}`]: {
          id: contactId,
          interaction,
          updatedAt: Date.now()
        }
      }
    }
  )
}

const removeFixtureContact = async (userId: string, contactId: string) => {
  await UserModel.updateOne({ _id: userId }, { $unset: { [`personal.contacts.${contactId}`]: '' } })
}

const ensureFixtureContact = async ({ nickname, interaction, reverseInteraction }: FixtureContactData) => {
  const fixture = USER_BY_NICKNAME[nickname]!

  await setFixtureContact(PRIMARY_FIXTURE_USER_ID, fixture.id, interaction)

  if (reverseInteraction) {
    await setFixtureContact(fixture.id, PRIMARY_FIXTURE_USER_ID, reverseInteraction)
    return
  }

  await removeFixtureContact(fixture.id, PRIMARY_FIXTURE_USER_ID)
}

const ensureFixtureContacts = async () => {
  await Promise.all(FIXTURE_CONTACTS.map(ensureFixtureContact))
}

const ensureDirectRoom = async (firstUserId: string, secondUserId: string) => {
  const existingRoom = await ChatRoomModel.findOne({
    users: { $all: [firstUserId, secondUserId], $size: 2 }
  })

  if (existingRoom) {
    await UserModel.updateOne({ _id: firstUserId }, { $addToSet: { 'personal.chatRooms': existingRoom.id } })
    await UserModel.updateOne({ _id: secondUserId }, { $addToSet: { 'personal.chatRooms': existingRoom.id } })
    return existingRoom
  }

  const room = await new ChatRoomModel({
    adminId: firstUserId,
    chatKind: CHAT_KIND.DIRECT,
    users: [firstUserId, secondUserId],
    chatName: '',
    pinnedMessageId: null,
    messages: []
  }).save()

  await UserModel.updateOne({ _id: firstUserId }, { $addToSet: { 'personal.chatRooms': room.id } })
  await UserModel.updateOne({ _id: secondUserId }, { $addToSet: { 'personal.chatRooms': room.id } })

  return room
}

const ensureGroupRooms = async () => {
  const rooms = await Promise.all(
    FIXTURE_GROUPS.map(async ({ key, adminNickname, chatName, avatarId, avatarPath, nicknames }) => {
      const users = nicknames.map((nickname) => USER_BY_NICKNAME[nickname]!.id)
      const adminId = USER_BY_NICKNAME[adminNickname]!.id

      const existingRoom = await ChatRoomModel.findOne({
        chatName,
        users: { $all: users, $size: users.length }
      })
      const room =
        existingRoom ??
        (await new ChatRoomModel({
          adminId,
          chatKind: CHAT_KIND.GROUP,
          users,
          chatName,
          avatarId: null,
          pinnedMessageId: null,
          messages: []
        }).save())

      await ensureChatRoomAvatarLoaded(room, avatarId, avatarPath)

      await Promise.all(
        users.map(async (userId) => {
          await UserModel.updateOne({ _id: userId }, { $addToSet: { 'personal.chatRooms': room.id } })
        })
      )

      return {
        key,
        room,
        users,
        nicknames
      }
    })
  )

  return rooms
}

const ensureMessages = async (roomId: string, fixtureMessages: ReturnType<typeof buildFixtureMessages>) => {
  const fixtureMessageIds = fixtureMessages.map(({ _id }) => _id)

  await Promise.all(
    fixtureMessages.map(async (message) => {
      await MessageModel.updateOne({ _id: message._id }, message, { upsert: true })
    })
  )

  const room = await ChatRoomModel.findById(roomId)
  const roomMessageIds = new Set(stringifyMongoIds(room?.messages ?? []))
  const missingRoomMessageIds = fixtureMessageIds.filter((id) => !roomMessageIds.has(id))

  if (!missingRoomMessageIds.length) {
    return
  }

  await ChatRoomModel.updateOne({ _id: roomId }, { $push: { messages: { $each: missingRoomMessageIds } } })
}

const loadDialogFixtures = async () => {
  await ensureFixtureContacts()
  const directRoom = await ensureDirectRoom(PRIMARY_FIXTURE_USER_ID, DIRECT_FIXTURE_CONTACT_USER_ID)
  const secondaryDirectRoom = await ensureDirectRoom(PRIMARY_FIXTURE_USER_ID, SECONDARY_DIRECT_FIXTURE_CONTACT_USER_ID)
  const tertiaryDirectRoom = await ensureDirectRoom(PRIMARY_FIXTURE_USER_ID, TERTIARY_DIRECT_FIXTURE_CONTACT_USER_ID)
  const quaternaryDirectRoom = await ensureDirectRoom(
    PRIMARY_FIXTURE_USER_ID,
    QUATERNARY_DIRECT_FIXTURE_CONTACT_USER_ID
  )

  await ensureFixtureMessageImagesLoaded()
  const imageObjectById = await loadFixtureMessageImageObjectById()
  await ensureMessages(
    directRoom.id,
    buildFixtureMessages(
      DIRECT_FIXTURE_MESSAGE_ID_PREFIX,
      [PRIMARY_FIXTURE_USER_ID, DIRECT_FIXTURE_CONTACT_USER_ID],
      [PRIMARY_FIXTURE_NICKNAME, DIRECT_FIXTURE_CONTACT_NICKNAME],
      DIRECT_FIXTURE_MESSAGES,
      DIRECT_FIXTURE_CREATED_AT_OFFSET_MS,
      imageObjectById
    )
  )
  await ensureMessages(
    secondaryDirectRoom.id,
    buildFixtureMessages(
      SECONDARY_DIRECT_FIXTURE_MESSAGE_ID_PREFIX,
      [PRIMARY_FIXTURE_USER_ID, SECONDARY_DIRECT_FIXTURE_CONTACT_USER_ID],
      [PRIMARY_FIXTURE_NICKNAME, SECONDARY_DIRECT_FIXTURE_CONTACT_NICKNAME],
      SECONDARY_DIRECT_FIXTURE_MESSAGES,
      SECONDARY_DIRECT_FIXTURE_CREATED_AT_OFFSET_MS,
      imageObjectById
    )
  )
  await ensureMessages(
    tertiaryDirectRoom.id,
    buildFixtureMessages(
      TERTIARY_DIRECT_FIXTURE_MESSAGE_ID_PREFIX,
      [PRIMARY_FIXTURE_USER_ID, TERTIARY_DIRECT_FIXTURE_CONTACT_USER_ID],
      [PRIMARY_FIXTURE_NICKNAME, TERTIARY_DIRECT_FIXTURE_CONTACT_NICKNAME],
      TERTIARY_DIRECT_FIXTURE_MESSAGES,
      TERTIARY_DIRECT_FIXTURE_CREATED_AT_OFFSET_MS,
      imageObjectById
    )
  )
  await ensureMessages(
    quaternaryDirectRoom.id,
    buildFixtureMessages(
      QUATERNARY_DIRECT_FIXTURE_MESSAGE_ID_PREFIX,
      [PRIMARY_FIXTURE_USER_ID, QUATERNARY_DIRECT_FIXTURE_CONTACT_USER_ID],
      [PRIMARY_FIXTURE_NICKNAME, QUATERNARY_DIRECT_FIXTURE_CONTACT_NICKNAME],
      QUATERNARY_DIRECT_FIXTURE_MESSAGES,
      QUATERNARY_DIRECT_FIXTURE_CREATED_AT_OFFSET_MS,
      imageObjectById
    )
  )

  const groupRooms = await ensureGroupRooms()
  const productStudioRoom = groupRooms.find(({ key }) => key === PRODUCT_STUDIO_FIXTURE_GROUP_KEY)!
  const weekendHouseRoom = groupRooms.find(({ key }) => key === WEEKEND_HOUSE_FIXTURE_GROUP_KEY)!

  await ensureMessages(
    productStudioRoom.room.id,
    buildFixtureMessages(
      PRODUCT_STUDIO_FIXTURE_MESSAGE_ID_PREFIX,
      productStudioRoom.users,
      productStudioRoom.nicknames,
      PRODUCT_STUDIO_FIXTURE_MESSAGES,
      PRODUCT_STUDIO_FIXTURE_CREATED_AT_OFFSET_MS,
      imageObjectById
    )
  )
  await ensureMessages(
    weekendHouseRoom.room.id,
    buildFixtureMessages(
      WEEKEND_HOUSE_FIXTURE_MESSAGE_ID_PREFIX,
      weekendHouseRoom.users,
      weekendHouseRoom.nicknames,
      WEEKEND_HOUSE_FIXTURE_MESSAGES,
      WEEKEND_HOUSE_FIXTURE_CREATED_AT_OFFSET_MS,
      imageObjectById
    )
  )
}

export const loadFixtures = async () => {
  await loadUserFixtures()
  await ensureUserPersonalContactsState()
  await ensureUserPersonalChatRoomState()
  await ensureChatRoomAvatarState()
  await cleanupLegacyFixtureData()
  await loadDialogFixtures()
}
