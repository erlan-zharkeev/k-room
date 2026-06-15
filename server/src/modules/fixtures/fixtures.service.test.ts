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
  deleteMany: vi.fn(),
  findById: vi.fn(),
  updateMany: vi.fn(),
  updateOne: vi.fn()
}))

const chatRoomModelMock = vi.hoisted(() => {
  class ChatRoomModel {
    static deleteMany = vi.fn()
    static find = vi.fn()
    static findOne = vi.fn()
    static findById = vi.fn()
    static updateMany = vi.fn()
    static updateOne = vi.fn()

    id = 'created-room'
    save = vi.fn().mockResolvedValue(this)
  }

  return { ChatRoomModel }
})

const messageModelMock = vi.hoisted(() => ({
  deleteMany: vi.fn(),
  updateOne: vi.fn()
}))

const logMock = vi.hoisted(() => ({
  info: vi.fn(),
  success: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
}))

vi.mock('../media/media.service', () => mediaMock)
vi.mock('../user/lib/user-existence', () => userServiceMock)
vi.mock('../user/user.model', () => ({ UserModel: userModelMock }))
vi.mock('../chat-rooms/chat-rooms.model', () => ({ ChatRoomModel: chatRoomModelMock.ChatRoomModel }))
vi.mock('../messages/messages.model', () => ({ MessageModel: messageModelMock }))
vi.mock('../../shared/lib/log', () => ({ log: logMock }))

const { loadFixtures } = await import('./fixtures.service')

const DIRECT_FIXTURE_MESSAGE_IDS = Array.from(
  { length: 12 },
  (_, idx) => `fixture-ethan-olivia-${String(idx + 1).padStart(3, '0')}`
)
const SECONDARY_DIRECT_FIXTURE_MESSAGE_IDS = Array.from(
  { length: 8 },
  (_, idx) => `fixture-ethan-maya-${String(idx + 1).padStart(3, '0')}`
)
const TERTIARY_DIRECT_FIXTURE_MESSAGE_IDS = Array.from(
  { length: 6 },
  (_, idx) => `fixture-ethan-noah-${String(idx + 1).padStart(3, '0')}`
)
const QUATERNARY_DIRECT_FIXTURE_MESSAGE_IDS = Array.from(
  { length: 6 },
  (_, idx) => `fixture-ethan-lucas-${String(idx + 1).padStart(3, '0')}`
)
const PRODUCT_STUDIO_FIXTURE_MESSAGE_IDS = Array.from(
  { length: 12 },
  (_, idx) => `fixture-product-studio-${String(idx + 1).padStart(3, '0')}`
)
const WEEKEND_HOUSE_FIXTURE_MESSAGE_IDS = Array.from(
  { length: 10 },
  (_, idx) => `fixture-weekend-house-${String(idx + 1).padStart(3, '0')}`
)

describe('fixtures.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mediaMock.uploadBufferToBucket.mockImplementation(
      async (_buffer, _bucketName, options) => options?.id ?? 'media-id'
    )
    userModelMock.db.collection.mockReturnValue({
      find: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue([
          {
            _id: '68f000000000000000000001',
            filename: 'fixture-image.webp',
            metadata: {
              height: 20,
              size: 10,
              sha256: 'sha',
              width: 30
            }
          },
          {
            _id: '68f000000000000000000002',
            filename: 'fixture-image-2.webp',
            metadata: {
              height: 40,
              size: 10,
              sha256: 'sha',
              width: 30
            }
          },
          {
            _id: '68f000000000000000000003',
            filename: 'fixture-image-3.webp',
            metadata: {
              height: 30,
              size: 10,
              sha256: 'sha',
              width: 30
            }
          },
          {
            _id: '68f000000000000000000004',
            filename: 'fixture-image-4.webp',
            metadata: {
              height: 20,
              size: 10,
              sha256: 'sha',
              width: 40
            }
          },
          {
            _id: '68f000000000000000000005',
            filename: 'fixture-image-5.webp',
            metadata: {
              height: 40,
              size: 10,
              sha256: 'sha',
              width: 40
            }
          }
        ])
      }),
      findOne: vi.fn().mockResolvedValue({ _id: 'existing-avatar' })
    })
    userModelMock.deleteMany.mockResolvedValue({ deletedCount: 0 })
    userModelMock.findById.mockResolvedValue({
      personal: { email: 'fixture@test.com' },
      public: { avatarId: 'existing-avatar-id', nickname: 'fixture' },
      set: vi.fn(function (this: { personal: { onboarding?: unknown } }, path: string, value: unknown) {
        if (path === 'personal.onboarding') {
          this.personal.onboarding = value
        }

        return this
      }),
      system: {
        confirmed: true,
        password: '$2b$06$9zZ6buzV0M3MTyS0wJ7ZUudLN4LxZ4XfN0iDHO8Y1koRaSPo6e7iW'
      },
      save: vi.fn()
    })
    userModelMock.updateMany.mockResolvedValue({ modifiedCount: 0 })
    chatRoomModelMock.ChatRoomModel.deleteMany.mockResolvedValue({ deletedCount: 0 })
    chatRoomModelMock.ChatRoomModel.find.mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([])
      })
    })
    chatRoomModelMock.ChatRoomModel.updateMany.mockResolvedValue({ modifiedCount: 0 })
    messageModelMock.deleteMany.mockResolvedValue({ deletedCount: 0 })
    userServiceMock.isUserExist.mockResolvedValue({ exists: true, reason: 'email' })
    chatRoomModelMock.ChatRoomModel.findOne.mockResolvedValue({
      id: 'room-1',
      avatarId: 'existing-room-avatar-id',
      save: vi.fn()
    })
    chatRoomModelMock.ChatRoomModel.findById.mockResolvedValue({
      messages: [
        ...DIRECT_FIXTURE_MESSAGE_IDS,
        ...SECONDARY_DIRECT_FIXTURE_MESSAGE_IDS,
        ...TERTIARY_DIRECT_FIXTURE_MESSAGE_IDS,
        ...QUATERNARY_DIRECT_FIXTURE_MESSAGE_IDS,
        ...PRODUCT_STUDIO_FIXTURE_MESSAGE_IDS,
        ...WEEKEND_HOUSE_FIXTURE_MESSAGE_IDS
      ]
    })
  })

  it('loads dev fixtures idempotently without duplicating existing users or room message links', async () => {
    await loadFixtures()

    expect(userServiceMock.isUserExist).toHaveBeenCalledTimes(7)
    expect(userServiceMock.createUser).not.toHaveBeenCalled()
    expect(userModelMock.findById).toHaveBeenCalledTimes(7)
    expect(mediaMock.uploadBufferToBucket).toHaveBeenCalledTimes(14)
    expect(mediaMock.uploadBufferToBucket).toHaveBeenCalledWith(expect.any(Buffer), 'image', {
      id: '68f100000000000000000001',
      overwrite: true,
      compression: 'avatar',
      validation: {
        maxMb: 10,
        supportedKindMediaType: 'image'
      }
    })
    expect(mediaMock.uploadBufferToBucket).toHaveBeenCalledWith(expect.any(Buffer), 'image', {
      id: '68f000000000000000000001',
      overwrite: true,
      compression: 'common-compressed'
    })
    expect(messageModelMock.updateOne).toHaveBeenCalledTimes(54)
    expect(messageModelMock.updateOne).toHaveBeenCalledWith(
      { _id: 'fixture-ethan-olivia-005' },
      expect.objectContaining({
        repliedMessage: expect.objectContaining({
          id: 'fixture-ethan-olivia-004',
          authorNickname: 'Olivia',
          body: expect.any(String)
        })
      }),
      { upsert: true }
    )
    expect(messageModelMock.updateOne).toHaveBeenCalledWith(
      { _id: 'fixture-ethan-noah-004' },
      expect.objectContaining({
        repliedMessage: expect.objectContaining({
          id: 'fixture-ethan-noah-003',
          authorNickname: 'Noah',
          body: expect.any(String)
        })
      }),
      { upsert: true }
    )
    expect(messageModelMock.updateOne).toHaveBeenCalledWith(
      { _id: 'fixture-ethan-lucas-004' },
      expect.objectContaining({
        repliedMessage: expect.objectContaining({
          id: 'fixture-ethan-lucas-003',
          authorNickname: 'Lucas',
          body: expect.any(String)
        })
      }),
      { upsert: true }
    )
    expect(messageModelMock.updateOne).toHaveBeenCalledWith(
      { _id: 'fixture-product-studio-004' },
      expect.objectContaining({
        authorNickname: 'Ethan',
        images: expect.arrayContaining([expect.objectContaining({ src: '68f000000000000000000004' })]),
        usersMetaData: expect.arrayContaining([expect.objectContaining({ status: 'delivered' })])
      }),
      { upsert: true }
    )
    expect(chatRoomModelMock.ChatRoomModel.updateOne).not.toHaveBeenCalled()
  })
})
