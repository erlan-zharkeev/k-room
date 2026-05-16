import { beforeEach, describe, expect, it, vi } from 'vitest'

const mediaMock = vi.hoisted(() => ({
  uploadBufferToBucket: vi.fn()
}))

const userServiceMock = vi.hoisted(() => ({
  createUser: vi.fn(),
  isUserExist: vi.fn()
}))

const userModelMock = vi.hoisted(() => ({
  db: {
    collection: vi.fn()
  },
  findById: vi.fn(),
  updateOne: vi.fn()
}))

const chatRoomModelMock = vi.hoisted(() => {
  class ChatRoomModel {
    static findOne = vi.fn()
    static findById = vi.fn()
    static updateOne = vi.fn()

    id = 'created-room'
    save = vi.fn().mockResolvedValue(this)
  }

  return { ChatRoomModel }
})

const messageModelMock = vi.hoisted(() => ({
  updateOne: vi.fn()
}))

const logMock = vi.hoisted(() => ({
  info: vi.fn(),
  success: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
}))

vi.mock('../media/media.service', () => mediaMock)
vi.mock('../user/user.service', () => userServiceMock)
vi.mock('../user/user.model', () => ({ UserModel: userModelMock }))
vi.mock('../chat-rooms/chat-rooms.model', () => ({ ChatRoomModel: chatRoomModelMock.ChatRoomModel }))
vi.mock('../messages/messages.model', () => ({ MessageModel: messageModelMock }))
vi.mock('../../shared/lib/log', () => ({ log: logMock }))

const { loadFixtures } = await import('./fixtures.service')

const DIRECT_FIXTURE_MESSAGE_IDS = Array.from(
  { length: 102 },
  (_, idx) => `fixture-erlan-tolik-${String(idx + 1).padStart(3, '0')}`
)
const FRONTEND_CORE_FIXTURE_MESSAGE_IDS = Array.from(
  { length: 102 },
  (_, idx) => `fixture-frontend-core-${String(idx + 1).padStart(3, '0')}`
)
const LONG_PRIVATE_FIXTURE_MESSAGE_IDS = Array.from(
  { length: 14 },
  (_, idx) => `fixture-long-private-${String(idx + 1).padStart(3, '0')}`
)

describe('fixtures.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    userModelMock.db.collection.mockReturnValue({
      findOne: vi.fn().mockResolvedValue({ _id: 'existing-avatar' })
    })
    userModelMock.findById.mockResolvedValue({
      personal: { email: 'fixture@test.com' },
      public: { nickname: 'fixture' },
      system: {
        confirmed: true,
        password: '$2b$06$9zZ6buzV0M3MTyS0wJ7ZUudLN4LxZ4XfN0iDHO8Y1koRaSPo6e7iW'
      },
      save: vi.fn()
    })
    userServiceMock.isUserExist.mockResolvedValue({ exists: true, reason: 'email' })
    chatRoomModelMock.ChatRoomModel.findOne.mockResolvedValue({ id: 'room-1' })
    chatRoomModelMock.ChatRoomModel.findById.mockResolvedValue({
      messages: [...DIRECT_FIXTURE_MESSAGE_IDS, ...FRONTEND_CORE_FIXTURE_MESSAGE_IDS, ...LONG_PRIVATE_FIXTURE_MESSAGE_IDS]
    })
  })

  it('loads dev fixtures idempotently without duplicating existing users or room message links', async () => {
    await loadFixtures()

    expect(userServiceMock.isUserExist).toHaveBeenCalledTimes(33)
    expect(userServiceMock.createUser).not.toHaveBeenCalled()
    expect(userModelMock.findById).toHaveBeenCalledTimes(33)
    expect(mediaMock.uploadBufferToBucket).not.toHaveBeenCalled()
    expect(messageModelMock.updateOne).toHaveBeenCalledTimes(218)
    expect(messageModelMock.updateOne).toHaveBeenCalledWith(
      { _id: 'fixture-erlan-tolik-100' },
      expect.objectContaining({
        repliedMessage: expect.objectContaining({
          id: 'fixture-erlan-tolik-096',
          authorNickname: 'tolik',
          body: expect.any(String)
        })
      }),
      { upsert: true }
    )
    expect(messageModelMock.updateOne).toHaveBeenCalledWith(
      { _id: 'fixture-long-private-014' },
      expect.objectContaining({
        authorNickname: expect.stringContaining('roma-max-nickname-'),
        usersMetaData: expect.arrayContaining([expect.objectContaining({ status: 'delivered' })])
      }),
      { upsert: true }
    )
    expect(chatRoomModelMock.ChatRoomModel.updateOne).not.toHaveBeenCalled()
  })
})
