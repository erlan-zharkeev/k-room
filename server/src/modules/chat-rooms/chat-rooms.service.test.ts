import { CHAT_KIND, PINNED_CHAT_ROOM_LIMIT, REQ_STATUS } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('timers/promises', () => ({
  setTimeout: vi.fn().mockResolvedValue(undefined)
}))

const chatRoomModelMock = vi.hoisted(() =>
  Object.assign(
    vi.fn((data: Record<string, unknown>) => ({
      _id: 'room-created',
      ...data,
      save: vi.fn().mockResolvedValue(undefined),
      toObject: vi.fn(() => ({
        _id: 'room-created',
        ...data
      }))
    })),
    {
      findOne: vi.fn(),
      findOneAndUpdate: vi.fn(),
      deleteOne: vi.fn()
    }
  )
)

const mediaServiceMock = vi.hoisted(() => ({
  deleteBucketFileById: vi.fn(),
  uploadBufferToBucket: vi.fn(),
  withUploadedMediaCleanup: vi.fn(async (callback) => callback(vi.fn()))
}))

const messagePersistenceMock = vi.hoisted(() => ({
  countUnreadMessagesByIds: vi.fn(),
  deleteMessagesByIds: vi.fn(),
  loadMessageById: vi.fn()
}))

const presenceUtilsMock = vi.hoisted(() => ({
  emitToUsers: vi.fn()
}))

const userPersistenceMock = vi.hoisted(() => ({
  addChatRoomToUsers: vi.fn(),
  addChatRoomToUsersByIds: vi.fn(),
  checkUsersAcceptedContacts: vi.fn(),
  loadUserMutedChatRoomsForRoom: vi.fn(),
  loadUserPinnedChatRooms: vi.fn(),
  loadUserPinnedChatRoomsForRoom: vi.fn(),
  loadUserPublicById: vi.fn(),
  loadUserRoomPreferences: vi.fn(),
  loadUsersChatRoomsByIds: vi.fn(),
  loadUsersPublicByIds: vi.fn(),
  removeChatRoomFromUser: vi.fn(),
  removeChatRoomFromUsersByIds: vi.fn(),
  setUserMutedChatRoomIds: vi.fn(),
  setUserPinnedChatRoomIds: vi.fn()
}))

vi.mock('./chat-rooms.model', () => ({
  ChatRoomModel: chatRoomModelMock
}))

vi.mock('../media/media.service', () => mediaServiceMock)
vi.mock('../messages/lib/message-persistence', () => messagePersistenceMock)
vi.mock('../messages/lib/resolve-visible-message-ids', () => ({
  resolveVisibleMessageIds: vi.fn((_userId: string, messageIds: string[]) => messageIds)
}))
vi.mock('../messages/lib/transform-message-for-user', () => ({
  transformMessageForUser: vi.fn((message) => ({ id: message._id ?? message.id }))
}))
vi.mock('../presence/presence.utils', () => presenceUtilsMock)
vi.mock('../user/lib/user-persistence', () => userPersistenceMock)

const serviceModule = await import('./chat-rooms.service')
const helperModule = await import('./lib/resolve-toggled-room-ids')
const {
  createChatRoom,
  deleteChatRoom,
  updateChatRoom,
  updateMutedChatRoom,
  updatePinnedChatRoom,
  updatePinnedChatRoomOrder
} = serviceModule
const { resolvePinnedChatRoomOrder, resolveToggledRoomIds } = helperModule

const createLeanQuery = <T>(value: T) => ({
  select: vi.fn(() => ({
    lean: vi.fn().mockResolvedValue(value)
  }))
})

describe('chat-rooms.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('toggles room id to the front and removes disabled room ids', () => {
    expect(resolveToggledRoomIds(['room-1', 'room-2'], 'room-3', true)).toEqual(['room-3', 'room-1', 'room-2'])
    expect(resolveToggledRoomIds(['room-1', 'room-2'], 'room-1', true)).toEqual(['room-1', 'room-2'])
    expect(resolveToggledRoomIds(['room-1', 'room-2'], 'room-1', false)).toEqual(['room-2'])
  })

  it('keeps pinned room ordering constrained to already pinned rooms', () => {
    expect(resolvePinnedChatRoomOrder(['room-1', 'room-2', 'room-3'], ['room-3', 'unknown', 'room-1'])).toEqual([
      'room-3',
      'room-1',
      'room-2'
    ])
  })

  it('updates pinned rooms and emits new pinned order', async () => {
    userPersistenceMock.loadUserPinnedChatRoomsForRoom.mockResolvedValue({
      personal: {
        pinnedChatRoomIds: ['room-1', 'room-2']
      }
    })

    await updatePinnedChatRoom('user-1', { roomId: 'room-3', isPinned: true })

    expect(userPersistenceMock.setUserPinnedChatRoomIds).toHaveBeenCalledWith('user-1', ['room-3', 'room-1', 'room-2'])
    expect(presenceUtilsMock.emitToUsers).toHaveBeenCalledWith(['user-1'], 'pinned-chat-rooms-updated', {
      roomId: 'room-3',
      isPinned: true,
      pinnedChatRoomIds: ['room-3', 'room-1', 'room-2']
    })
  })

  it('rejects pinning over pinned room limit', async () => {
    userPersistenceMock.loadUserPinnedChatRoomsForRoom.mockResolvedValue({
      personal: {
        pinnedChatRoomIds: Array.from({ length: PINNED_CHAT_ROOM_LIMIT }, (_, index) => `room-${index}`)
      }
    })

    await expect(updatePinnedChatRoom('user-1', { roomId: 'room-new', isPinned: true })).rejects.toMatchObject({
      status: REQ_STATUS.badRequest
    })

    expect(userPersistenceMock.setUserPinnedChatRoomIds).not.toHaveBeenCalled()
  })

  it('updates pinned room order without accepting unknown room ids', async () => {
    userPersistenceMock.loadUserPinnedChatRooms.mockResolvedValue({
      personal: {
        pinnedChatRoomIds: ['room-1', 'room-2', 'room-3']
      }
    })

    await updatePinnedChatRoomOrder('user-1', {
      pinnedChatRoomIds: ['room-3', 'unknown-room', 'room-1']
    })

    expect(userPersistenceMock.setUserPinnedChatRoomIds).toHaveBeenCalledWith('user-1', ['room-3', 'room-1', 'room-2'])
  })

  it('updates muted rooms and emits new muted order', async () => {
    userPersistenceMock.loadUserMutedChatRoomsForRoom.mockResolvedValue({
      personal: {
        mutedChatRoomIds: ['room-1']
      }
    })

    await updateMutedChatRoom('user-1', { roomId: 'room-2', isMuted: true })

    expect(userPersistenceMock.setUserMutedChatRoomIds).toHaveBeenCalledWith('user-1', ['room-2', 'room-1'])
    expect(presenceUtilsMock.emitToUsers).toHaveBeenCalledWith(['user-1'], 'muted-chat-rooms-updated', {
      roomId: 'room-2',
      isMuted: true,
      mutedChatRoomIds: ['room-2', 'room-1']
    })
  })

  it('creates room with authenticated user added to members server-side', async () => {
    userPersistenceMock.checkUsersAcceptedContacts.mockResolvedValue(true)
    userPersistenceMock.loadUsersChatRoomsByIds.mockResolvedValue([
      { personal: { chatRooms: [] } },
      { personal: { chatRooms: [] } }
    ])
    userPersistenceMock.loadUserRoomPreferences.mockResolvedValue(null)

    await createChatRoom('user-1', { memberIds: ['user-2'] }, {} as never)

    expect(userPersistenceMock.checkUsersAcceptedContacts).toHaveBeenCalledWith('user-1', ['user-2'])
    expect(chatRoomModelMock).toHaveBeenCalledWith(
      expect.objectContaining({
        users: ['user-1', 'user-2'],
        adminId: 'user-1',
        chatKind: CHAT_KIND.DIRECT
      })
    )
    expect(userPersistenceMock.addChatRoomToUsers).toHaveBeenCalledWith('room-created', ['user-1', 'user-2'])
  })

  it('updates room with authenticated admin preserved in members server-side', async () => {
    const room = {
      _id: 'room-1',
      adminId: 'user-1',
      avatarId: null,
      chatKind: CHAT_KIND.GROUP,
      chatName: 'Old chat',
      users: ['user-1', 'user-2'],
      messages: []
    }
    const updatedRoom = {
      ...room,
      chatName: 'Next chat',
      users: ['user-1', 'user-2', 'user-3']
    }

    chatRoomModelMock.findOne.mockReturnValueOnce(createLeanQuery(room))
    chatRoomModelMock.findOneAndUpdate.mockReturnValueOnce(createLeanQuery(updatedRoom))
    userPersistenceMock.checkUsersAcceptedContacts.mockResolvedValue(true)
    userPersistenceMock.loadUsersChatRoomsByIds.mockResolvedValue([{ personal: { chatRooms: [] } }])
    userPersistenceMock.addChatRoomToUsersByIds.mockResolvedValue({ modifiedCount: 1 })
    userPersistenceMock.removeChatRoomFromUsersByIds.mockResolvedValue({ modifiedCount: 0 })
    userPersistenceMock.loadUserRoomPreferences.mockResolvedValue(null)

    await updateChatRoom(
      'user-1',
      {
        roomId: 'room-1',
        memberIds: ['user-2', 'user-3'],
        chatName: ' Next chat '
      },
      {} as never
    )

    expect(userPersistenceMock.checkUsersAcceptedContacts).toHaveBeenCalledWith('user-1', ['user-3'])
    expect(chatRoomModelMock.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'room-1' },
      {
        $set: {
          avatarId: null,
          chatName: 'Next chat',
          users: ['user-1', 'user-2', 'user-3']
        }
      },
      { new: true }
    )
    expect(userPersistenceMock.addChatRoomToUsersByIds).toHaveBeenCalledWith('room-1', ['user-3'])
    expect(userPersistenceMock.removeChatRoomFromUsersByIds).toHaveBeenCalledWith('room-1', [])
  })

  it('deletes direct chat room with messages for all room users', async () => {
    const execRemoveRoomFromUsers = vi.fn().mockResolvedValue(undefined)
    const room = {
      adminId: 'user-1',
      avatarId: 'avatar-1',
      chatKind: CHAT_KIND.DIRECT,
      users: ['user-1', 'user-2'],
      messages: ['message-1', 'message-2']
    }

    chatRoomModelMock.findOne.mockReturnValue(createLeanQuery(room))
    chatRoomModelMock.deleteOne.mockReturnValue({ exec: vi.fn().mockResolvedValue(undefined) })
    userPersistenceMock.removeChatRoomFromUsersByIds.mockReturnValue({ exec: execRemoveRoomFromUsers })

    await deleteChatRoom('user-2', { roomId: 'room-1' })

    expect(chatRoomModelMock.deleteOne).toHaveBeenCalledWith({ _id: 'room-1' })
    expect(messagePersistenceMock.deleteMessagesByIds).toHaveBeenCalledWith(['message-1', 'message-2'])
    expect(userPersistenceMock.removeChatRoomFromUsersByIds).toHaveBeenCalledWith('room-1', ['user-1', 'user-2'])
    expect(mediaServiceMock.deleteBucketFileById).not.toHaveBeenCalled()
    expect(presenceUtilsMock.emitToUsers).toHaveBeenCalledWith(['user-1', 'user-2'], 'chat-room-deleted', {
      roomId: 'room-1'
    })
  })

  it('does not delete group chat room when requester is not admin', async () => {
    chatRoomModelMock.findOne.mockReturnValue(
      createLeanQuery({
        adminId: 'user-1',
        avatarId: 'avatar-1',
        chatKind: CHAT_KIND.GROUP,
        users: ['user-1', 'user-2'],
        messages: ['message-1']
      })
    )

    await deleteChatRoom('user-2', { roomId: 'room-1' })

    expect(chatRoomModelMock.deleteOne).not.toHaveBeenCalled()
    expect(messagePersistenceMock.deleteMessagesByIds).not.toHaveBeenCalled()
  })
})
