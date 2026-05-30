import { MESSAGE_LINK_PREVIEW_STATUS, type MessageLinkPreview } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const messageModelMock = vi.hoisted(() => ({
  updateOne: vi.fn()
}))

const mediaMock = vi.hoisted(() => ({
  deleteBucketFileById: vi.fn()
}))

const presenceMock = vi.hoisted(() => ({
  emitToUsers: vi.fn()
}))

const loadPreviewMock = vi.hoisted(() => ({
  loadMessageLinkPreview: vi.fn()
}))

const logMock = vi.hoisted(() => ({
  error: vi.fn()
}))

vi.mock('../messages.model', () => ({ MessageModel: messageModelMock }))
vi.mock('../../media/media.service', () => mediaMock)
vi.mock('../../presence/presence.utils', () => presenceMock)
vi.mock('src/shared/lib/log', () => ({ log: logMock }))
vi.mock('./load-message-link-preview', () => loadPreviewMock)

const { refreshMessageLinkPreview } = await import('./refresh-message-link-preview')

const pendingPreview: MessageLinkPreview = {
  url: 'https://example.com/',
  host: 'example.com',
  status: MESSAGE_LINK_PREVIEW_STATUS.PENDING
}

const loadedPreview: MessageLinkPreview = {
  ...pendingPreview,
  status: MESSAGE_LINK_PREVIEW_STATUS.LOADED,
  title: 'Example',
  image: {
    src: 'image-id',
    name: 'example'
  }
}

describe('refreshMessageLinkPreview', () => {
  beforeEach(() => {
    loadPreviewMock.loadMessageLinkPreview.mockResolvedValue(loadedPreview)
  })

  it('updates pending preview and emits live update', async () => {
    messageModelMock.updateOne.mockResolvedValue({ modifiedCount: 1 })

    refreshMessageLinkPreview({
      linkPreview: pendingPreview,
      messageId: 'message-1',
      roomId: 'room-1',
      userIds: ['user-1', 'user-2']
    })

    await vi.waitFor(() => expect(messageModelMock.updateOne).toHaveBeenCalled())

    expect(messageModelMock.updateOne).toHaveBeenCalledWith(
      {
        _id: 'message-1',
        'linkPreview.url': pendingPreview.url,
        'linkPreview.status': MESSAGE_LINK_PREVIEW_STATUS.PENDING
      },
      { $set: { linkPreview: loadedPreview } }
    )
    expect(presenceMock.emitToUsers).toHaveBeenCalledWith(['user-1', 'user-2'], 'message-link-preview-updated', {
      roomId: 'room-1',
      messageId: 'message-1',
      linkPreview: loadedPreview
    })
  })

  it('deletes uploaded image when message preview is no longer pending', async () => {
    messageModelMock.updateOne.mockResolvedValue({ modifiedCount: 0 })

    refreshMessageLinkPreview({
      linkPreview: pendingPreview,
      messageId: 'message-1',
      roomId: 'room-1',
      userIds: ['user-1']
    })

    await vi.waitFor(() => expect(mediaMock.deleteBucketFileById).toHaveBeenCalled())

    expect(mediaMock.deleteBucketFileById).toHaveBeenCalledWith('image', 'image-id')
    expect(presenceMock.emitToUsers).not.toHaveBeenCalled()
  })

  it('logs background errors without throwing', async () => {
    loadPreviewMock.loadMessageLinkPreview.mockRejectedValue(new Error('network failed'))

    refreshMessageLinkPreview({
      linkPreview: pendingPreview,
      messageId: 'message-1',
      roomId: 'room-1',
      userIds: ['user-1']
    })

    await vi.waitFor(() => expect(logMock.error).toHaveBeenCalled())

    expect(logMock.error).toHaveBeenCalledWith('-Message link preview update failed: network failed')
  })
})
