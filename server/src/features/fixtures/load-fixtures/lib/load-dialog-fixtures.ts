import { ChatRoomModel } from 'entities/chat-room'
import { MessageModel } from 'entities/message'
import { USER_FIXTURES, UserModel } from 'entities/user'

const ERLAN_ID = USER_FIXTURES.find(({ username }) => username === 'erlan')?.id ?? ''
const TOLIK_ID = USER_FIXTURES.find(({ username }) => username === 'tolik')?.id ?? ''

const MESSAGE_COUNT = 100
const MESSAGE_INTERVAL_MS = 1000 * 60 * 7
const CONTACT_INTERACTION = 'invite-accepted'

const buildFixtureMessageId = (idx: number) => `fixture-erlan-tolik-${String(idx).padStart(3, '0')}`

const buildFixtureMessage = (idx: number) => {
  const isErlanAuthor = idx % 2 !== 0
  const authorId = isErlanAuthor ? ERLAN_ID : TOLIK_ID
  const authorName = isErlanAuthor ? 'erlan' : 'tolik'
  const createdAt = String(Date.now() - (MESSAGE_COUNT - idx) * MESSAGE_INTERVAL_MS)

  return {
    _id: buildFixtureMessageId(idx),
    authorId,
    authorName,
    body: `Fixture message ${idx} between erlan and tolik`,
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

const ensureContacts = async () => {
  const updatedAt = Date.now()

  await UserModel.updateOne(
    { _id: ERLAN_ID },
    {
      $set: {
        [`personal.contacts.${TOLIK_ID}`]: {
          id: TOLIK_ID,
          interaction: CONTACT_INTERACTION,
          updatedAt
        }
      }
    }
  )

  await UserModel.updateOne(
    { _id: TOLIK_ID },
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
}

const ensureRoom = async () => {
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

export const loadDialogFixtures = async () => {
  if (!ERLAN_ID || !TOLIK_ID) return

  await ensureContacts()
  const room = await ensureRoom()

  const fixtureMessages = Array.from({ length: MESSAGE_COUNT }, (_, idx) => buildFixtureMessage(idx + 1))
  const fixtureMessageIds = fixtureMessages.map(({ _id }) => _id)
  const existingMessages = await MessageModel.find({ _id: { $in: fixtureMessageIds } }).select('_id').lean()
  const existingMessageIds = new Set(existingMessages.map(({ _id }) => String(_id)))
  const missingMessages = fixtureMessages.filter(({ _id }) => !existingMessageIds.has(_id))

  if (missingMessages.length) {
    await MessageModel.insertMany(missingMessages, { ordered: true })
  }

  const roomMessageIds = new Set((room.messages ?? []).map((id) => String(id)))
  const missingRoomMessageIds = fixtureMessageIds.filter((id) => !roomMessageIds.has(id))

  if (missingRoomMessageIds.length) {
    await ChatRoomModel.updateOne({ _id: room.id }, { $push: { messages: { $each: missingRoomMessageIds } } })
  }
}
