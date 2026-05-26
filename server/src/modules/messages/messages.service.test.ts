import { beforeEach, describe, expect, it, vi } from 'vitest'

const chatRoomModelMock = vi.hoisted(() => ({
  findOne: vi.fn()
}))

const messageModelMock = vi.hoisted(() => ({
  findOne: vi.fn(),
  findOneAndUpdate: vi.fn()
}))

const userModelMock = vi.hoisted(() => ({
  findById: vi.fn()
}))

const mediaMock = vi.hoisted(() => ({
  uploadBufferToBucket: vi.fn()
}))

const presenceMock = vi.hoisted(() => ({
  emitToUsers: vi.fn()
}))

vi.mock('../chat-rooms/chat-rooms.model', () => ({ ChatRoomModel: chatRoomModelMock }))
vi.mock('./messages.model', () => ({ MessageModel: messageModelMock }))
vi.mock('../user/user.model', () => ({ UserModel: userModelMock }))
vi.mock('../media/media.service', () => mediaMock)
vi.mock('../presence/presence.utils', () => presenceMock)

const { toggleMessageReaction } = await import('./messages.service')

const createLeanQuery = (value: unknown) => ({
  select: vi.fn().mockReturnThis(),
  lean: vi.fn().mockResolvedValue(value)
})

describe('messages.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds reaction and emits final reactions list', async () => {
    const reaction = {
      authorId: 'user-1',
      nickname: 'tester',
      glyphKey: '\u{1F44D}'
    }
    const payload = {
      roomId: 'room-1',
      messageId: 'message-1',
      glyphKey: reaction.glyphKey
    }

    chatRoomModelMock.findOne.mockReturnValue(createLeanQuery({ users: ['user-1', 'user-2'] }))
    messageModelMock.findOne.mockReturnValue(createLeanQuery({ reactions: [] }))
    userModelMock.findById.mockReturnValue(createLeanQuery({ public: { nickname: reaction.nickname } }))
    messageModelMock.findOneAndUpdate.mockReturnValue(createLeanQuery({ reactions: [reaction] }))

    await toggleMessageReaction('user-1', payload)

    expect(chatRoomModelMock.findOne).toHaveBeenCalledWith({
      _id: payload.roomId,
      users: 'user-1',
      messages: payload.messageId
    })
    expect(messageModelMock.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: payload.messageId, deletedForUserIds: { $ne: 'user-1' } },
      { $addToSet: { reactions: reaction } },
      { new: true }
    )
    expect(presenceMock.emitToUsers).toHaveBeenCalledWith(['user-1', 'user-2'], 'message-reaction-updated', {
      roomId: payload.roomId,
      messageId: payload.messageId,
      reactions: [reaction]
    })
  })

  it('removes existing reaction and emits final reactions list', async () => {
    const reaction = {
      authorId: 'user-1',
      nickname: 'tester',
      glyphKey: '\u{1F44D}'
    }
    const payload = {
      roomId: 'room-1',
      messageId: 'message-1',
      glyphKey: reaction.glyphKey
    }

    chatRoomModelMock.findOne.mockReturnValue(createLeanQuery({ users: ['user-1', 'user-2'] }))
    messageModelMock.findOne.mockReturnValue(createLeanQuery({ reactions: [reaction] }))
    userModelMock.findById.mockReturnValue(createLeanQuery({ public: { nickname: reaction.nickname } }))
    messageModelMock.findOneAndUpdate.mockReturnValue(createLeanQuery({ reactions: [] }))

    await toggleMessageReaction('user-1', payload)

    expect(messageModelMock.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: payload.messageId, deletedForUserIds: { $ne: 'user-1' } },
      { $pull: { reactions: { authorId: 'user-1', glyphKey: reaction.glyphKey } } },
      { new: true }
    )
    expect(presenceMock.emitToUsers).toHaveBeenCalledWith(['user-1', 'user-2'], 'message-reaction-updated', {
      roomId: payload.roomId,
      messageId: payload.messageId,
      reactions: []
    })
  })
})
