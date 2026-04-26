import { WELCOME_INFO_NOTIFICATION_ID } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const ioMock = vi.hoisted(() => ({
  emit: vi.fn(),
  to: vi.fn()
}))

const infoNotificationModelMock = vi.hoisted(() => ({
  find: vi.fn(),
  findById: vi.fn(),
  updateOne: vi.fn(),
  create: vi.fn()
}))

const infoNotificationStateModelMock = vi.hoisted(() => ({
  find: vi.fn(),
  findOneAndUpdate: vi.fn(),
  updateOne: vi.fn()
}))

const userModelMock = vi.hoisted(() => ({
  find: vi.fn()
}))

const userServiceMock = vi.hoisted(() => ({
  getSocketsByUserIds: vi.fn()
}))

const logMock = vi.hoisted(() => ({
  info: vi.fn(),
  success: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
}))

vi.mock('../../shared/lib/io', () => ({
  getIO: () => ioMock
}))
vi.mock('../../shared/lib/log', () => ({ log: logMock }))
vi.mock('./info-notifications.model', () => ({
  InfoNotificationModel: infoNotificationModelMock
}))
vi.mock('./info-notification-state.model', () => ({
  InfoNotificationStateModel: infoNotificationStateModelMock
}))
vi.mock('../user/user.model', () => ({ UserModel: userModelMock }))
vi.mock('../user/user.service', () => userServiceMock)

const service = await import('./info-notifications.service')

const selectLean = (value: unknown) => ({
  select: vi.fn().mockReturnValue({
    lean: vi.fn().mockResolvedValue(value)
  })
})

describe('info-notifications.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ioMock.to.mockReturnValue({ emit: ioMock.emit })
  })

  it('builds initial notification map from active notifications created after user signup', async () => {
    const sort = vi.fn().mockReturnValue({
      lean: vi
        .fn()
        .mockResolvedValue([
          { _id: 'notification-2', title: {}, content: {}, isActive: true, createdAt: 200, updatedAt: 200 }
        ])
    })

    infoNotificationModelMock.find.mockReturnValue({ sort })

    const result = await service.getInitialInfoNotificationMap(123)

    expect(infoNotificationModelMock.find).toHaveBeenCalledWith(
      { isActive: true, createdAt: { $gte: 123 } },
      { __v: 0 }
    )
    expect(result).toEqual({
      [WELCOME_INFO_NOTIFICATION_ID]: 'unread',
      'notification-2': 'unread'
    })
  })

  it('publishes notification only to users that do not already have it', async () => {
    const user1 = '68a09410778b70d522ea8fa0'
    const user2 = '68a09410778b70d522ea8fa1'
    const notification = {
      _id: 'notification-1',
      title: { en: 'Title', ru: 'Заголовок', zh: '标题' },
      content: { en: ['Text'], ru: ['Текст'], zh: ['文本'] },
      isActive: false,
      createdAt: 1,
      updatedAt: 1
    }

    infoNotificationModelMock.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue(notification) })
    userModelMock.find.mockReturnValue(selectLean([{ _id: user1 }, { _id: user2 }]))
    infoNotificationStateModelMock.find.mockReturnValue(
      selectLean([
        {
          userId: user1,
          infoNotifications: {
            'notification-1': 'read'
          }
        }
      ])
    )
    userServiceMock.getSocketsByUserIds.mockResolvedValue(['socket-2'])

    await service.publishInfoNotificationToAllUsers('notification-1', 'en')

    expect(infoNotificationModelMock.updateOne).toHaveBeenCalledWith(
      { _id: 'notification-1' },
      { $set: { isActive: true, updatedAt: expect.any(Number) } }
    )
    expect(infoNotificationStateModelMock.updateOne).toHaveBeenCalledTimes(1)
    expect(infoNotificationStateModelMock.updateOne).toHaveBeenCalledWith(
      { userId: expect.objectContaining({}) },
      { $set: { 'infoNotifications.notification-1': 'unread' } },
      { upsert: true }
    )
    expect(String(infoNotificationStateModelMock.updateOne.mock.calls[0][0].userId)).toBe(user2)
    expect(userServiceMock.getSocketsByUserIds).toHaveBeenCalledWith([user2])
    expect(ioMock.to).toHaveBeenCalledWith('socket-2')
    expect(ioMock.emit).toHaveBeenCalledWith(
      'info-notification-received',
      expect.objectContaining({
        id: 'notification-1',
        isActive: true,
        status: 'unread'
      })
    )
  })

  it('loads missing info notification fixtures without duplicating existing records', async () => {
    infoNotificationModelMock.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) })

    await service.loadInfoNotificationFixtures()

    expect(infoNotificationModelMock.create).toHaveBeenCalledTimes(1)
    expect(infoNotificationModelMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        isActive: true,
        title: expect.objectContaining({
          en: 'Welcome to K-Room'
        })
      })
    )
  })
})
