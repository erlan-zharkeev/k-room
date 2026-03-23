import { ChatRoomModel } from 'entities/chat-room'
import { MessageModel } from 'entities/message'
import { USER_FIXTURES, UserModel } from 'entities/user'

const ERLAN_ID = USER_FIXTURES.find(({ username }) => username === 'erlan')?.id ?? ''
const TOLIK_ID = USER_FIXTURES.find(({ username }) => username === 'tolik')?.id ?? ''

const MESSAGE_COUNT = 101
const CONTACT_INTERACTION = 'invite-accepted'
const DAY_IN_MS = 1000 * 60 * 60 * 24
const HOUR_IN_MS = 1000 * 60 * 60

const MESSAGE_TEMPLATES = [
  'Are you already there?',
  'Yes, I just arrived. How about you?',
  'I am on the way. I will be there in about twenty minutes.',
  'Alright, I will grab a coffee and take the table by the window.',
  'Nice. Did you review yesterday\'s call notes?',
  'Yes, I wrote down a few points about the chat flow.',
  'The main thing left is proper paginated message loading.',
  'Agreed. We also need to preserve scroll position per room.',
  'I am thinking about storing firstVisibleItemId for that.',
  'That sounds better than relying on raw scrollTop.',
  'Then I will take the client side and you handle the server?',
  'Works for me. I will set up the contract and the beforeCreatedAt cursor.',
  'Great. We should also verify the reopen-room scenario.',
  'Yes, especially when the room is already selected on page load.',
  'After that we can properly test the virtualized list.',
  'And we should prepare realistic fixtures instead of placeholder text.',
  'Let us spread the conversation across several days so the date separators are obvious.',
  'Exactly. That will also make the upward loading behavior easier to verify.',
  'Alright, let us sync again in the evening.',
  'Sounds good. I will send an update as soon as my part is done.'
]

const buildFixtureMessageId = (idx: number) => `fixture-erlan-tolik-${String(idx).padStart(3, '0')}`

const buildFixtureMessage = (idx: number) => {
  const isErlanAuthor = idx % 2 !== 0
  const authorId = isErlanAuthor ? ERLAN_ID : TOLIK_ID
  const authorName = isErlanAuthor ? 'erlan' : 'tolik'
  const dayOffset = Math.floor((idx - 1) / 20)
  const messageOffsetInDay = (idx - 1) % 20
  const createdAt = String(
    Date.now()
    - (4 - dayOffset) * DAY_IN_MS
    + (9 + Math.floor(messageOffsetInDay / 2)) * HOUR_IN_MS
    + (messageOffsetInDay % 2) * 1000 * 60 * 18
  )
  const body = MESSAGE_TEMPLATES[(idx - 1) % MESSAGE_TEMPLATES.length]

  return {
    _id: buildFixtureMessageId(idx),
    authorId,
    authorName,
    body,
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
  await Promise.all(
    fixtureMessages.map(async (message) => {
      await MessageModel.updateOne({ _id: message._id }, message, { upsert: true })
    })
  )

  const roomMessageIds = new Set((room.messages ?? []).map((id) => String(id)))
  const missingRoomMessageIds = fixtureMessageIds.filter((id) => !roomMessageIds.has(id))

  await ChatRoomModel.updateOne(
    { _id: room.id },
    missingRoomMessageIds.length ? { $push: { messages: { $each: missingRoomMessageIds } } } : {}
  )
}
