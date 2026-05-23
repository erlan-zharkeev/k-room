import fs from 'node:fs/promises'
import path from 'node:path'

import bcrypt from 'bcryptjs'
import { CHAT_KIND, DAY_IN_MS, MESSAGE_STATUS_VALUE, MINUTE_IN_MS, REQ_STATUS, buildAvatarId } from 'global-shared'
import compact from 'lodash/compact'
import countBy from 'lodash/countBy'
import { Types } from 'mongoose'

import { ChatRoomModel } from 'src/modules/chat-rooms/chat-rooms.model'
import { uploadBufferToBucket } from 'src/modules/media/media.service'
import { MessageModel } from 'src/modules/messages/messages.model'
import { FIXTURE_GROUPS, FIXTURE_MESSAGE_COUNT, USER_FIXTURES } from 'src/modules/user/user.constants'
import { USER_I18N } from 'src/modules/user/user.i18n'
import { UserModel } from 'src/modules/user/user.model'
import { createUser, isUserExist } from 'src/modules/user/user.service'
import { AppError } from 'src/shared/lib/app-error'
import { log } from 'src/shared/lib/log'

import {
  BASE_FIXTURE_TIMESTAMP_MS,
  DIRECT_FIXTURE_MESSAGE_ID_PREFIX,
  ERLAN_ID,
  FIXTURE_CONTACTS,
  FIXTURE_LONG_REPLIED_MESSAGE_BODY,
  FIXTURE_MESSAGE_IMAGE_FILES,
  FIXTURE_MESSAGE_REACTIONS_BY_INDEX,
  FIXTURE_REPLIED_MESSAGE_INDEX,
  FIXTURE_REPLY_TARGET_MESSAGE_INDEX,
  FIXTURE_SENDING_MESSAGE_INDEX,
  FIXTURE_TOLIK_MESSAGE_IMAGES_BY_INDEX,
  FRONTEND_CORE_FIXTURE_GROUP_KEY,
  FRONTEND_CORE_FIXTURE_MESSAGE_ID_PREFIX,
  LONG_PRIVATE_FIXTURE_CONTACT_NICKNAME,
  LONG_PRIVATE_FIXTURE_CREATED_AT_OFFSET_MS,
  LONG_PRIVATE_FIXTURE_MESSAGE_BODY,
  LONG_PRIVATE_FIXTURE_MESSAGE_COUNT,
  LONG_PRIVATE_FIXTURE_MESSAGE_ID_PREFIX,
  MESSAGE_ACTIONS,
  MESSAGE_QUALIFIERS,
  MESSAGE_SUBJECTS,
  TOLIK_ID,
  USER_BY_NICKNAME
} from './fixtures.constants'
import type { FixtureContactData, FixtureUserData } from './fixtures.types'

const ensureAvatarLoaded = async (userId: string, avatarPath: string) => {
  const filename = buildAvatarId(userId)
  const existingAvatar = await UserModel.db.collection('avatar.files').findOne({ filename })

  if (existingAvatar) {
    return false
  }

  const buffer = await fs.readFile(path.resolve(avatarPath))

  await uploadBufferToBucket(buffer, filename, 'avatar', {
    overwrite: true,
    compression: 'avatar'
  })

  return true
}

const loadUserFixture = async (data: FixtureUserData) => {
  const { id, nickname, email, pass, avatarPath } = data
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

      if (!(await bcrypt.compare(pass, existingUser.system.password))) {
        existingUser.system.password = await bcrypt.hash(pass, 6)
        wasUpdated = true
      }

      if (wasUpdated) {
        await existingUser.save()
      }
    }

    const avatarLoaded = await ensureAvatarLoaded(id, avatarPath)

    return avatarLoaded || wasUpdated ? 'updated' : 'skipped'
  }

  const hashedPassword = await bcrypt.hash(pass, 6)
  const user = await createUser({ id: identifier, email, nickname, hashedPassword })

  if (!user) {
    return 'failed'
  }

  await user.set('system.confirmed', true).save()
  await ensureAvatarLoaded(id, avatarPath)

  return 'created'
}

const loadUserFixtures = async () => {
  const results = await Promise.all(USER_FIXTURES.map((data) => loadUserFixture(data)))
  const resultCount = countBy(results)
  const { created = 0, updated = 0, skipped = 0, failed = 0 } = resultCount

  log.info(`-User fixtures processed: created=${created}, updated=${updated}, skipped=${skipped}, failed=${failed}`)
}

const buildFixtureMessageId = (prefix: string, idx: number) => `${prefix}-${String(idx).padStart(3, '0')}`

const ensureMessageImageLoaded = async (filename: string, imagePath: string) => {
  const existingImage = await UserModel.db.collection('image.files').findOne({ filename })

  if (existingImage) {
    return false
  }

  const buffer = await fs.readFile(path.resolve(imagePath))

  await uploadBufferToBucket(buffer, filename, 'image', {
    overwrite: true,
    compression: 'common-compressed'
  })

  return true
}

const ensureFixtureMessageImagesLoaded = async () => {
  await Promise.all(FIXTURE_MESSAGE_IMAGE_FILES.map((image) => ensureMessageImageLoaded(image.filename, image.path)))
}

const buildFixtureMessageBody = (idx: number) => {
  const subject = MESSAGE_SUBJECTS[(idx - 1) % MESSAGE_SUBJECTS.length]
  const action = MESSAGE_ACTIONS[Math.floor((idx - 1) / MESSAGE_SUBJECTS.length) % MESSAGE_ACTIONS.length]
  const qualifier =
    MESSAGE_QUALIFIERS[
      Math.floor((idx - 1) / (MESSAGE_SUBJECTS.length * MESSAGE_ACTIONS.length)) % MESSAGE_QUALIFIERS.length
    ]

  return `Fixture note ${String(idx).padStart(3, '0')}: ${subject} ${action} ${qualifier}.`
}

const buildFixtureMessageReactions = (idx: number, roomNicknames: readonly string[]) => {
  const roomNicknameSet = new Set(roomNicknames)

  return (FIXTURE_MESSAGE_REACTIONS_BY_INDEX[idx] ?? []).flatMap(({ nickname, glyphKey }) => {
    if (!roomNicknameSet.has(nickname)) {
      return []
    }

    const authorId = USER_BY_NICKNAME[nickname]?.id

    return authorId ? [{ nickname, authorId, glyphKey }] : []
  })
}

const buildFixtureRepliedMessage = (prefix: string) => {
  const targetAuthorNickname = 'tolik'

  return {
    id: buildFixtureMessageId(prefix, FIXTURE_REPLY_TARGET_MESSAGE_INDEX),
    authorNickname: targetAuthorNickname,
    authorId: TOLIK_ID,
    body: FIXTURE_LONG_REPLIED_MESSAGE_BODY,
    images: [...(FIXTURE_TOLIK_MESSAGE_IMAGES_BY_INDEX[FIXTURE_REPLY_TARGET_MESSAGE_INDEX] ?? [])]
  }
}

const buildFixtureMessage = (
  idx: number,
  prefix: string,
  roomUserIds: readonly string[],
  roomNicknames: readonly string[]
) => {
  const isErlanAuthor = idx % 2 !== 0
  const authorId = isErlanAuthor ? ERLAN_ID : TOLIK_ID
  const authorNickname = isErlanAuthor ? 'erlan' : 'tolik'
  const createdAt = BASE_FIXTURE_TIMESTAMP_MS + idx * (37 * MINUTE_IN_MS) + Math.floor(idx / 18) * DAY_IN_MS

  return {
    _id: buildFixtureMessageId(prefix, idx),
    authorId,
    authorNickname,
    body: buildFixtureMessageBody(idx),
    createdAt,
    reactions: buildFixtureMessageReactions(idx, roomNicknames),
    images: [...(FIXTURE_TOLIK_MESSAGE_IMAGES_BY_INDEX[idx] ?? [])],
    usersMetaData: roomUserIds.map((id) => ({ id, status: MESSAGE_STATUS_VALUE.DELIVERED })),
    repliedMessage: idx === FIXTURE_REPLIED_MESSAGE_INDEX ? buildFixtureRepliedMessage(prefix) : null
  }
}

const buildFixtureSendingMessage = (
  prefix: string,
  roomUserIds: readonly string[],
  roomNicknames: readonly string[]
) => {
  const createdAt =
    BASE_FIXTURE_TIMESTAMP_MS +
    FIXTURE_SENDING_MESSAGE_INDEX * (37 * MINUTE_IN_MS) +
    Math.floor(FIXTURE_SENDING_MESSAGE_INDEX / 18) * DAY_IN_MS

  return {
    _id: buildFixtureMessageId(prefix, FIXTURE_SENDING_MESSAGE_INDEX),
    authorId: ERLAN_ID,
    authorNickname: 'erlan',
    body: buildFixtureMessageBody(100),
    createdAt,
    reactions: buildFixtureMessageReactions(100, roomNicknames),
    images: FIXTURE_MESSAGE_IMAGE_FILES.map(({ filename }) => filename),
    usersMetaData: roomUserIds.map((id) => ({ id, status: MESSAGE_STATUS_VALUE.SENDING })),
    repliedMessage: null
  }
}

const buildFixtureMessages = (prefix: string, roomUserIds: readonly string[], roomNicknames: readonly string[]) => [
  ...Array.from({ length: FIXTURE_MESSAGE_COUNT }, (_, idx) =>
    buildFixtureMessage(idx + 1, prefix, roomUserIds, roomNicknames)
  ),
  buildFixtureSendingMessage(prefix, roomUserIds, roomNicknames)
]

const buildLongPrivateFixtureMessage = (idx: number, contactId: string, contactNickname: string) => ({
  _id: buildFixtureMessageId(LONG_PRIVATE_FIXTURE_MESSAGE_ID_PREFIX, idx),
  authorId: contactId,
  authorNickname: contactNickname,
  body: `${LONG_PRIVATE_FIXTURE_MESSAGE_BODY} ${String(idx).padStart(2, '0')}.`,
  createdAt: BASE_FIXTURE_TIMESTAMP_MS + LONG_PRIVATE_FIXTURE_CREATED_AT_OFFSET_MS + idx * MINUTE_IN_MS,
  reactions: [],
  images: [],
  usersMetaData: [ERLAN_ID, contactId].map((id) => ({ id, status: MESSAGE_STATUS_VALUE.DELIVERED })),
  repliedMessage: null
})

const buildLongPrivateFixtureMessages = (contactId: string, contactNickname: string) =>
  Array.from({ length: LONG_PRIVATE_FIXTURE_MESSAGE_COUNT }, (_, idx) =>
    buildLongPrivateFixtureMessage(idx + 1, contactId, contactNickname)
  )

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
  const fixture = USER_BY_NICKNAME[nickname]

  if (!fixture) {
    return
  }

  await setFixtureContact(ERLAN_ID, fixture.id, interaction)

  if (reverseInteraction) {
    await setFixtureContact(fixture.id, ERLAN_ID, reverseInteraction)
    return
  }

  await removeFixtureContact(fixture.id, ERLAN_ID)
}

const ensureFixtureContacts = async () => {
  await Promise.all(FIXTURE_CONTACTS.map(ensureFixtureContact))
}

const ensureDirectRoom = async () => {
  const existingRoom = await ChatRoomModel.findOne({
    users: { $all: [ERLAN_ID, TOLIK_ID], $size: 2 }
  })

  if (existingRoom) {
    await UserModel.updateOne({ _id: ERLAN_ID }, { $addToSet: { 'personal.chatRooms': existingRoom.id } })
    await UserModel.updateOne({ _id: TOLIK_ID }, { $addToSet: { 'personal.chatRooms': existingRoom.id } })
    return existingRoom
  }

  const room = await new ChatRoomModel({
    adminId: ERLAN_ID,
    chatKind: CHAT_KIND.DIRECT,
    users: [ERLAN_ID, TOLIK_ID],
    chatName: '',
    messages: []
  }).save()

  await UserModel.updateOne({ _id: ERLAN_ID }, { $addToSet: { 'personal.chatRooms': room.id } })
  await UserModel.updateOne({ _id: TOLIK_ID }, { $addToSet: { 'personal.chatRooms': room.id } })

  return room
}

const ensureLongPrivateFixtureRoom = async (contactId: string) => {
  const existingRoom = await ChatRoomModel.findOne({
    users: { $all: [ERLAN_ID, contactId], $size: 2 }
  })

  if (existingRoom) {
    await UserModel.updateOne({ _id: ERLAN_ID }, { $addToSet: { 'personal.chatRooms': existingRoom.id } })
    await UserModel.updateOne({ _id: contactId }, { $addToSet: { 'personal.chatRooms': existingRoom.id } })
    return existingRoom
  }

  const room = await new ChatRoomModel({
    adminId: ERLAN_ID,
    chatKind: CHAT_KIND.DIRECT,
    users: [ERLAN_ID, contactId],
    chatName: '',
    messages: []
  }).save()

  await UserModel.updateOne({ _id: ERLAN_ID }, { $addToSet: { 'personal.chatRooms': room.id } })
  await UserModel.updateOne({ _id: contactId }, { $addToSet: { 'personal.chatRooms': room.id } })

  return room
}

const ensureGroupRooms = async () => {
  const rooms = await Promise.all(
    FIXTURE_GROUPS.map(async ({ key, adminNickname, chatName, nicknames }) => {
      const users = compact(nicknames.map((nickname) => USER_BY_NICKNAME[nickname]?.id))
      const adminId = USER_BY_NICKNAME[adminNickname]?.id

      if (!adminId || users.length !== nicknames.length) {
        return null
      }

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
          messages: []
        }).save())

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

  return compact(rooms)
}

const ensureMessages = async (roomId: string, fixtureMessages: ReturnType<typeof buildFixtureMessages>) => {
  const fixtureMessageIds = fixtureMessages.map(({ _id }) => _id)

  await Promise.all(
    fixtureMessages.map(async (message) => {
      await MessageModel.updateOne({ _id: message._id }, message, { upsert: true })
    })
  )

  const room = await ChatRoomModel.findById(roomId)
  const roomMessageIds = new Set((room?.messages ?? []).map((id) => String(id)))
  const missingRoomMessageIds = fixtureMessageIds.filter((id) => !roomMessageIds.has(id))

  if (!missingRoomMessageIds.length) {
    return
  }

  await ChatRoomModel.updateOne({ _id: roomId }, { $push: { messages: { $each: missingRoomMessageIds } } })
}

const loadDialogFixtures = async () => {
  if (!ERLAN_ID || !TOLIK_ID) {
    throw new AppError(REQ_STATUS.server, USER_I18N.userNotFound)
  }

  await ensureFixtureContacts()
  const directRoom = await ensureDirectRoom()
  const longPrivateFixtureContact = USER_BY_NICKNAME[LONG_PRIVATE_FIXTURE_CONTACT_NICKNAME]

  await ensureFixtureMessageImagesLoaded()
  await ensureMessages(
    directRoom.id,
    buildFixtureMessages(DIRECT_FIXTURE_MESSAGE_ID_PREFIX, [ERLAN_ID, TOLIK_ID], ['erlan', 'tolik'])
  )

  if (longPrivateFixtureContact) {
    const longPrivateRoom = await ensureLongPrivateFixtureRoom(longPrivateFixtureContact.id)

    await ensureMessages(
      longPrivateRoom.id,
      buildLongPrivateFixtureMessages(longPrivateFixtureContact.id, longPrivateFixtureContact.nickname)
    )
  }

  const groupRooms = await ensureGroupRooms()
  const frontendCoreRoom = groupRooms.find(({ key }) => key === FRONTEND_CORE_FIXTURE_GROUP_KEY)

  if (frontendCoreRoom) {
    await ensureMessages(
      frontendCoreRoom.room.id,
      buildFixtureMessages(FRONTEND_CORE_FIXTURE_MESSAGE_ID_PREFIX, frontendCoreRoom.users, frontendCoreRoom.nicknames)
    )
  }
}

export const loadFixtures = async () => {
  await loadUserFixtures()
  await loadDialogFixtures()
}
