import {
  BASE_FIXTURE_TIMESTAMP,
  CONTACT_INTERACTION,
  DAY_IN_MS,
  MESSAGE_ACTIONS,
  MESSAGE_QUALIFIERS,
  MESSAGE_SUBJECTS,
  MINUTE_IN_MS
} from 'src/features/fixtures'

import { ChatRoomModel } from 'src/entities/chat-room'
import { MessageModel } from 'src/entities/message'
import {
  FIXTURE_CONTACT_USERNAMES,
  FIXTURE_GROUPS,
  FIXTURE_MESSAGE_COUNT,
  UserModel
} from 'src/entities/user'

import { ERLAN_ID, TOLIK_ID, USER_BY_USERNAME } from './constants'

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
  const authorName = isErlanAuthor ? 'erlan' : 'tolik'
  const createdAt = BASE_FIXTURE_TIMESTAMP + idx * (37 * MINUTE_IN_MS) + Math.floor(idx / 18) * DAY_IN_MS

  return {
    _id: buildFixtureMessageId(idx),
    authorId,
    authorName,
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
  const erlanContacts = FIXTURE_CONTACT_USERNAMES.map((username) => USER_BY_USERNAME[username]).filter(Boolean)

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
    FIXTURE_GROUPS.map(async ({ authorUsername, chatName, usernames }) => {
      const users = usernames.map((username) => USER_BY_USERNAME[username]?.id).filter(Boolean)
      const authorId = USER_BY_USERNAME[authorUsername]?.id
      if (!authorId || users.length !== usernames.length) return

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

  await ChatRoomModel.updateOne(
    { _id: roomId },
    missingRoomMessageIds.length ? { $push: { messages: { $each: missingRoomMessageIds } } } : {}
  )
}

export const loadDialogFixtures = async () => {
  if (!ERLAN_ID || !TOLIK_ID) return

  await ensureAcceptedContacts()
  const directRoom = await ensureDirectRoom()

  await ensureMessages(directRoom.id)
  await ensureGroupRooms()
}
