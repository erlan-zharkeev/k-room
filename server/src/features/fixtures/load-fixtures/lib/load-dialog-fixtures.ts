import { ChatRoomModel } from 'entities/chat-room'
import { MessageModel } from 'entities/message'
import { FIXTURE_CONTACT_USERNAMES, FIXTURE_GROUPS, FIXTURE_MESSAGE_COUNT, USER_FIXTURES, UserModel } from 'entities/user'

const CONTACT_INTERACTION = 'invite-accepted'
const DAY_IN_MS = 1000 * 60 * 60 * 24
const MINUTE_IN_MS = 1000 * 60
const BASE_FIXTURE_TIMESTAMP = Date.UTC(2026, 1, 1, 8, 0, 0)

const USER_BY_USERNAME = Object.fromEntries(USER_FIXTURES.map((fixture) => [fixture.username, fixture])) as Record<string, typeof USER_FIXTURES[number]>

const ERLAN_ID = USER_BY_USERNAME.erlan?.id ?? ''
const TOLIK_ID = USER_BY_USERNAME.tolik?.id ?? ''

const MESSAGE_SUBJECTS = [
  'search contacts',
  'socket reconnect flow',
  'message pagination',
  'chat room sorting',
  'device permissions',
  'notification center',
  'group room updates',
  'image upload flow',
  'scroll restoration',
  'profile editing'
] as const

const MESSAGE_ACTIONS = [
  'looks stable after the last patch',
  'still needs a regression check',
  'started behaving better in Chromium',
  'shows the edge case more clearly now',
  'needs cleaner empty-state handling',
  'benefits from stronger typing',
  'should be covered by a smoke test',
  'would be easier to inspect with better fixtures',
  'is ready for another review pass',
  'should be rechecked after deploy'
] as const

const MESSAGE_QUALIFIERS = [
  'before lunch',
  'after the nightly restart',
  'when the room is reopened',
  'on a fresh session',
  'after clearing the cache',
  'while testing on mobile width',
  'with multiple rooms selected in sequence',
  'after a silent token refresh',
  'when the modal is opened twice',
  'while the websocket reconnects'
] as const

const buildFixtureMessageId = (idx: number) => `fixture-erlan-tolik-${String(idx).padStart(3, '0')}`

const buildFixtureMessageBody = (idx: number) => {
  const subject = MESSAGE_SUBJECTS[(idx - 1) % MESSAGE_SUBJECTS.length]
  const action = MESSAGE_ACTIONS[Math.floor((idx - 1) / MESSAGE_SUBJECTS.length) % MESSAGE_ACTIONS.length]
  const qualifier = MESSAGE_QUALIFIERS[Math.floor((idx - 1) / (MESSAGE_SUBJECTS.length * MESSAGE_ACTIONS.length)) % MESSAGE_QUALIFIERS.length]

  return `Fixture note ${String(idx).padStart(3, '0')}: ${subject} ${action} ${qualifier}.`
}

const buildFixtureMessage = (idx: number) => {
  const isErlanAuthor = idx % 2 !== 0
  const authorId = isErlanAuthor ? ERLAN_ID : TOLIK_ID
  const authorName = isErlanAuthor ? 'erlan' : 'tolik'
  const createdAt = String(BASE_FIXTURE_TIMESTAMP + idx * (37 * MINUTE_IN_MS) + Math.floor(idx / 18) * DAY_IN_MS)

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

      const room = existingRoom ?? await new ChatRoomModel({
        authorId,
        users,
        chatName,
        messages: []
      }).save()

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
