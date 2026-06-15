import { CHAT_KIND, PINNED_CHAT_ROOM_LIMIT, REQ_STATUS } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const chatRoomModelMock = vi.hoisted(() => ({
  findOne: vi.fn(),
  deleteOne: vi.fn()
}))

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
vi.mock('../messages/messages.service', () => ({
  transformMessageForUser: vi.fn((message) => ({ id: message._id ?? message.id }))
}))
vi.mock('../presence/presence.utils', () => presenceUtilsMock)
vi.mock('../user/lib/user-persistence', () => userPersistenceMock)

const serviceModule = await import('./chat-rooms.service')
const helperModule = await import('./lib/resolve-toggled-room-ids')
const { deleteChatRoom, updateMutedChatRoom, updatePinnedChatRoom, updatePinnedChatRoomOrder } = serviceModule
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
