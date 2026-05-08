import fs from 'node:fs/promises'
import path from 'node:path'

import bcrypt from 'bcryptjs'
import { type AppLanguageType, DEFAULT_APP_LANGUAGE, REQ_STATUS } from 'global-shared'
import { Types } from 'mongoose'

import { ChatRoomModel } from 'src/modules/chat-rooms/chat-rooms.model'
import { uploadBufferToBucket } from 'src/modules/media/media.service'
import { MessageModel } from 'src/modules/messages/messages.model'
import {
  FIXTURE_CONTACT_USERNAMES,
  FIXTURE_GROUPS,
  FIXTURE_MESSAGE_COUNT,
  USER_FIXTURES
} from 'src/modules/user/user.constants'
import { USER_I18N } from 'src/modules/user/user.i18n'
import { UserModel } from 'src/modules/user/user.model'
import { createUser, isUserExist } from 'src/modules/user/user.service'
import { AppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'
import { log } from 'src/shared/lib/log'

import {
  BASE_FIXTURE_TIMESTAMP_MS,
  CONTACT_INTERACTION,
  DAY_IN_MS,
  MESSAGE_ACTIONS,
  MESSAGE_QUALIFIERS,
  MESSAGE_SUBJECTS,
  MINUTE_IN_MS
} from './fixtures.constants'

const USER_BY_NICKNAME = Object.fromEntries(USER_FIXTURES.map((fixture) => [fixture.nickname, fixture]))
const ERLAN_ID = USER_BY_NICKNAME.erlan?.id ?? ''
const TOLIK_ID = USER_BY_NICKNAME.tolik?.id ?? ''

const ensureAvatarLoaded = async (userId: string, avatarPath: string, language: AppLanguageType) => {
  const filename = `avatar.${userId}`
  const existingAvatar = await UserModel.db.collection('avatar.files').findOne({ filename })

  if (existingAvatar) {
    return false
  }

  const buffer = await fs.readFile(path.resolve(avatarPath))

  await uploadBufferToBucket(buffer, filename, 'avatar', language, {
    overwrite: true,
    compression: 'avatar'
  })

  return true
}

const loadUserFixture = async (
  data: {
    id: string
    email: string
    nickname: string
    pass: string
    avatarPath: string
  },
  language: AppLanguageType
) => {
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

    const avatarLoaded = await ensureAvatarLoaded(id, avatarPath, language)

    return avatarLoaded || wasUpdated ? 'updated' : 'skipped'
  }

  const hashedPassword = await bcrypt.hash(pass, 6)
  const user = await createUser({ id: identifier, email, nickname, hashedPassword })

  if (!user) {
    return 'failed'
  }

  await user.set('system.confirmed', true).save()
  await ensureAvatarLoaded(id, avatarPath, language)

  return 'created'
}

const loadUserFixtures = async (language: AppLanguageType = DEFAULT_APP_LANGUAGE) => {
  const results = await Promise.all(USER_FIXTURES.map((data) => loadUserFixture(data, language)))
  const created = results.filter((result) => result === 'created').length
  const updated = results.filter((result) => result === 'updated').length
  const skipped = results.filter((result) => result === 'skipped').length
  const failed = results.filter((result) => result === 'failed').length

  log.info(`-User fixtures processed: created=${created}, updated=${updated}, skipped=${skipped}, failed=${failed}`)
}

const buildFixtureMessageId = (idx: number) => `fixture-erlan-tolik-${String(idx).padStart(3, '0')}`

const buildFixtureMessageBody = (idx: number) => {
  const subject = MESSAGE_SUBJECTS[(idx - 1) % MESSAGE_SUBJECTS.length]
  const action = MESSAGE_ACTIONS[Math.floor((idx - 1) / MESSAGE_SUBJECTS.length) % MESSAGE_ACTIONS.length]
  const qualifier =
    MESSAGE_QUALIFIERS[
      Math.floor((idx - 1) / (MESSAGE_SUBJECTS.length * MESSAGE_ACTIONS.length)) % MESSAGE_QUALIFIERS.length
    ]

  return `Fixture note ${String(idx).padStart(3, '0')}: ${subject} ${action} ${qualifier}.`
}

const buildFixtureMessage = (idx: number) => {
  const isErlanAuthor = idx % 2 !== 0
  const authorId = isErlanAuthor ? ERLAN_ID : TOLIK_ID
  const authorNickname = isErlanAuthor ? 'erlan' : 'tolik'
  const createdAt = BASE_FIXTURE_TIMESTAMP_MS + idx * (37 * MINUTE_IN_MS) + Math.floor(idx / 18) * DAY_IN_MS

  return {
    _id: buildFixtureMessageId(idx),
    authorId,
    authorNickname,
    body: buildFixtureMessageBody(idx),
    createdAt,
    reactions: [],
    images: [],
    usersMetaData: [
      { id: ERLAN_ID, status: 'delivered' },
      { id: TOLIK_ID, status: 'delivered' }
    ],
    repliedMessage: null
  }
}

const ensureAcceptedContacts = async () => {
  const updatedAt = Date.now()
  const erlanContacts = FIXTURE_CONTACT_USERNAMES.map((nickname) => USER_BY_NICKNAME[nickname]).filter(Boolean)

  await Promise.all(
    erlanContacts.flatMap((fixture) => [
      UserModel.updateOne(
        { _id: ERLAN_ID },
        {
          $set: {
            [`personal.contacts.${fixture.id}`]: {
              id: fixture.id,
              interaction: CONTACT_INTERACTION,
              updatedAt
            }
          }
        }
      ),
      UserModel.updateOne(
        { _id: fixture.id },
        {
          $set: {
            [`personal.contacts.${ERLAN_ID}`]: {
              id: ERLAN_ID,
              interaction: CONTACT_INTERACTION,
              updatedAt
            }
          }
        }
      )
    ])
  )
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
    authorId: ERLAN_ID,
    users: [ERLAN_ID, TOLIK_ID],
    chatName: '',
    messages: []
  }).save()

  await UserModel.updateOne({ _id: ERLAN_ID }, { $addToSet: { 'personal.chatRooms': room.id } })
  await UserModel.updateOne({ _id: TOLIK_ID }, { $addToSet: { 'personal.chatRooms': room.id } })

  return room
}

const ensureGroupRooms = async () => {
  await Promise.all(
    FIXTURE_GROUPS.map(async ({ authorNickname, chatName, nicknames }) => {
      const users = nicknames.map((nickname) => USER_BY_NICKNAME[nickname]?.id).filter(Boolean)
      const authorId = USER_BY_NICKNAME[authorNickname]?.id

      if (!authorId || users.length !== nicknames.length) {
        return
      }

      const existingRoom = await ChatRoomModel.findOne({
        chatName,
        users: { $all: users, $size: users.length }
      })
      const room =
        existingRoom ??
        (await new ChatRoomModel({
          authorId,
          users,
          chatName,
          messages: []
        }).save())

      await Promise.all(
        users.map(async (userId) => {
          await UserModel.updateOne({ _id: userId }, { $addToSet: { 'personal.chatRooms': room.id } })
        })
      )
    })
  )
}

const ensureMessages = async (roomId: string) => {
  const fixtureMessages = Array.from({ length: FIXTURE_MESSAGE_COUNT }, (_, idx) => buildFixtureMessage(idx + 1))
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
    throw new AppError(REQ_STATUS.server, localizedText(USER_I18N.userNotFound, DEFAULT_APP_LANGUAGE))
  }

  await ensureAcceptedContacts()
  const directRoom = await ensureDirectRoom()

  await ensureMessages(directRoom.id)
  await ensureGroupRooms()
}

export const loadFixtures = async () => {
  await loadUserFixtures(DEFAULT_APP_LANGUAGE)
  await loadDialogFixtures()
}
