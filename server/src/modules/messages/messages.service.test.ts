import {
  MESSAGE_LINK_PREVIEW_STATUS,
  MESSAGE_REACTION_LIMIT_PER_USER,
  MESSAGE_REACTION_UPDATE_ACTION
} from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const chatRoomModelMock = vi.hoisted(() => ({
  findOne: vi.fn(),
  updateOne: vi.fn()
}))

const messageModelMock = vi.hoisted(() =>
  Object.assign(
    vi.fn((data: { _id: string }) => ({
      id: data._id,
      save: vi.fn().mockResolvedValue({ id: data._id })
    })),
    {
      updateOne: vi.fn()
    }
  )
)

const userModelMock = vi.hoisted(() => ({
  findById: vi.fn()
}))

const mediaMock = vi.hoisted(() => ({
  uploadBufferToBucket: vi.fn(),
  uploadBufferToBucketWithFileData: vi.fn()
}))

const presenceMock = vi.hoisted(() => ({
  emitToUsers: vi.fn()
}))

const refreshLinkPreviewMock = vi.hoisted(() => ({
  refreshMessageLinkPreview: vi.fn()
}))

vi.mock('../chat-rooms/chat-rooms.model', () => ({ ChatRoomModel: chatRoomModelMock }))
vi.mock('./messages.model', () => ({ MessageModel: messageModelMock }))
vi.mock('../user/user.model', () => ({ UserModel: userModelMock }))
vi.mock('../media/media.service', () => mediaMock)
vi.mock('../presence/presence.utils', () => presenceMock)
vi.mock('./lib/refresh-message-link-preview', () => refreshLinkPreviewMock)

const { editMessage, emitRoomTypingStatus, sendMessage, toggleMessageReaction } = await import('./messages.service')

const createLeanQuery = (value: unknown) => ({
  select: vi.fn().mockReturnThis(),
  lean: vi.fn().mockResolvedValue(value)
})

describe('messages.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('edits own message and emits message update', async () => {
    const payload = {
      roomId: 'room-1',
      messageId: 'message-1',
      body: ' updated message ',
      images: [{ src: 'image-1', name: 'image-1' }]
    }

    chatRoomModelMock.findOne.mockReturnValue(createLeanQuery({ users: ['user-1', 'user-2'] }))
    messageModelMock.updateOne.mockResolvedValueOnce({ modifiedCount: 1 })

    await editMessage('user-1', payload)

    expect(chatRoomModelMock.findOne).toHaveBeenCalledWith({
      _id: payload.roomId,
      users: 'user-1',
      messages: payload.messageId
    })
    expect(messageModelMock.updateOne).toHaveBeenCalledWith(
      {
        _id: payload.messageId,
        authorId: 'user-1',
        deletedForUserIds: { $ne: 'user-1' },
        $and: [{ $or: [{ images: 'image-1' }, { images: { $elemMatch: { src: 'image-1' } } }] }]
      },
      {
        $set: {
          body: 'updated message',
          images: payload.images,
          linkPreview: null,
          editedAt: expect.any(Number)
        }
      }
    )
    expect(presenceMock.emitToUsers).toHaveBeenCalledWith(['user-1', 'user-2'], 'message-edited', {
      roomId: payload.roomId,
      messageId: payload.messageId,
      body: 'updated message',
      images: payload.images,
      linkPreview: null,
      editedAt: expect.any(Number)
    })
  })

  it('edits message with https link and starts link preview refresh', async () => {
    const payload = {
      roomId: 'room-1',
      messageId: 'message-1',
      body: 'https://example.com/',
      images: []
    }
    const linkPreview = {
      url: 'https://example.com/',
      host: 'example.com',
      status: MESSAGE_LINK_PREVIEW_STATUS.PENDING
    }

    chatRoomModelMock.findOne.mockReturnValue(createLeanQuery({ users: ['user-1', 'user-2'] }))
    messageModelMock.updateOne.mockResolvedValueOnce({ modifiedCount: 1 })

    await editMessage('user-1', payload)

    expect(messageModelMock.updateOne).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        $set: expect.objectContaining({ linkPreview })
      })
    )
    expect(refreshLinkPreviewMock.refreshMessageLinkPreview).toHaveBeenCalledWith({
      appName: 'K-Room',
      linkPreview,
      messageId: payload.messageId,
      roomId: payload.roomId,
      userIds: ['user-1', 'user-2']
    })
  })

  it('emits typing status only to other room users', async () => {
    chatRoomModelMock.findOne.mockReturnValue(createLeanQuery({ users: ['user-1', 'user-2', 'user-3'] }))

    await emitRoomTypingStatus('user-1', { roomId: 'room-1', isTyping: true })

    expect(chatRoomModelMock.findOne).toHaveBeenCalledWith({ _id: 'room-1', users: 'user-1' })
    expect(presenceMock.emitToUsers).toHaveBeenCalledWith(['user-2', 'user-3'], 'room-typing-status', {
      roomId: 'room-1',
      contactId: 'user-1',
      isTyping: true
    })
  })

  it('sends message with author resolved from authenticated user', async () => {
    const payload = {
      roomId: 'room-1',
      userId: 'user-1',
      message: {
        id: 'message-1',
        authorId: 'spoofed-user',
        authorNickname: 'spoofed',
        body: 'hello',
        createdAt: 1,
        images: [],
        reactions: []
      }
    }

    chatRoomModelMock.findOne.mockReturnValue(createLeanQuery({ users: ['user-1', 'user-2'], messages: [] }))
    userModelMock.findById.mockReturnValue(createLeanQuery({ public: { nickname: 'tester' } }))
    chatRoomModelMock.updateOne.mockResolvedValueOnce({ modifiedCount: 1 })
    messageModelMock.updateOne.mockResolvedValue({ modifiedCount: 1 })

    await sendMessage(payload)

    expect(messageModelMock).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: 'message-1',
        authorId: 'user-1',
        authorNickname: 'tester'
      })
    )
    expect(presenceMock.emitToUsers).toHaveBeenCalledWith(['user-1'], 'message-delivered', {
      roomId: 'room-1',
      message: expect.objectContaining({
        id: 'message-1',
        authorId: 'user-1',
        authorNickname: 'tester',
        isSelf: true
      })
    })
    expect(presenceMock.emitToUsers).toHaveBeenCalledWith(['user-2'], 'message-delivered', {
      roomId: 'room-1',
      message: expect.objectContaining({
        id: 'message-1',
        authorId: 'user-1',
        authorNickname: 'tester',
        isSelf: false
      })
    })
  })

  it('adds reaction and emits reaction update', async () => {
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
    userModelMock.findById.mockReturnValue(createLeanQuery({ public: { nickname: reaction.nickname } }))
    messageModelMock.updateOne.mockResolvedValueOnce({ modifiedCount: 0 })
    messageModelMock.updateOne.mockResolvedValueOnce({ modifiedCount: 1 })

    await toggleMessageReaction('user-1', payload)

    expect(chatRoomModelMock.findOne).toHaveBeenCalledWith({
      _id: payload.roomId,
      users: 'user-1',
      messages: payload.messageId
    })
    expect(messageModelMock.updateOne).toHaveBeenNthCalledWith(
      1,
      { _id: payload.messageId, deletedForUserIds: { $ne: 'user-1' } },
      { $pull: { reactions: { authorId: 'user-1', glyphKey: reaction.glyphKey } } }
    )
    expect(messageModelMock.updateOne).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        _id: payload.messageId,
        deletedForUserIds: { $ne: 'user-1' },
        $expr: {
          $lt: [expect.any(Object), MESSAGE_REACTION_LIMIT_PER_USER]
        }
      }),
      { $addToSet: { reactions: reaction } }
    )
    expect(presenceMock.emitToUsers).toHaveBeenCalledWith(['user-1', 'user-2'], 'message-reaction-updated', {
      roomId: payload.roomId,
      messageId: payload.messageId,
      action: MESSAGE_REACTION_UPDATE_ACTION.ADD,
      reaction
    })
  })

  it('removes existing reaction and emits reaction update', async () => {
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
    userModelMock.findById.mockReturnValue(createLeanQuery({ public: { nickname: reaction.nickname } }))
    messageModelMock.updateOne.mockResolvedValueOnce({ modifiedCount: 1 })

    await toggleMessageReaction('user-1', payload)

    expect(messageModelMock.updateOne).toHaveBeenCalledTimes(1)
    expect(messageModelMock.updateOne).toHaveBeenCalledWith(
      { _id: payload.messageId, deletedForUserIds: { $ne: 'user-1' } },
      { $pull: { reactions: { authorId: 'user-1', glyphKey: reaction.glyphKey } } }
    )
    expect(presenceMock.emitToUsers).toHaveBeenCalledWith(['user-1', 'user-2'], 'message-reaction-updated', {
      roomId: payload.roomId,
      messageId: payload.messageId,
      action: MESSAGE_REACTION_UPDATE_ACTION.REMOVE,
      reaction
    })
  })

  it('does not emit reaction update when user reaction limit is reached', async () => {
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
    userModelMock.findById.mockReturnValue(createLeanQuery({ public: { nickname: reaction.nickname } }))
    messageModelMock.updateOne.mockResolvedValueOnce({ modifiedCount: 0 })
    messageModelMock.updateOne.mockResolvedValueOnce({ modifiedCount: 0 })

    await toggleMessageReaction('user-1', payload)

    expect(messageModelMock.updateOne).toHaveBeenCalledTimes(2)
    expect(messageModelMock.updateOne).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        $expr: {
          $lt: [expect.any(Object), MESSAGE_REACTION_LIMIT_PER_USER]
        }
      }),
      { $addToSet: { reactions: reaction } }
    )
    expect(presenceMock.emitToUsers).not.toHaveBeenCalled()
  })
})
