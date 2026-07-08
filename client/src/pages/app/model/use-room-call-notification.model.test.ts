import type { EventRoomCallStarted } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const chatRoomStoreMock = vi.hoisted(() => ({
  getById: vi.fn()
}))

const contactByIdMock = vi.hoisted(() => ({
  value: new Map()
}))

const knownUserByIdMock = vi.hoisted(() => ({
  value: new Map()
}))

const mediaMock = vi.hoisted(() => ({
  get: vi.fn()
}))

const appSoundMock = vi.hoisted(() => ({
  startLoopAppSound: vi.fn(),
  stopAppSound: vi.fn()
}))

const settingsMock = vi.hoisted(() => ({
  value: {
    notifications: {
      enabled: true,
      general: {
        toast: true,
        sound: true,
        vibration: true,
        browserPush: true,
        nativePush: true
      },
      messages: {
        toast: true,
        sound: true,
        vibration: true,
        browserPush: true,
        nativePush: true
      },
      calls: {
        toast: true,
        sound: true,
        vibration: true,
        browserPush: true,
        nativePush: true
      },
      groupCalls: {
        toast: true,
        sound: false,
        vibration: false,
        browserPush: true,
        nativePush: true
      },
      invites: {
        toast: true,
        sound: true,
        vibration: true,
        browserPush: true,
        nativePush: true
      }
    }
  }
}))

const systemMock = vi.hoisted(() => ({
  hasInteracted: {
    value: true
  }
}))

const userMock = vi.hoisted(() => ({
  user: {
    value: {
      id: 'current-user'
    }
  }
}))

const toastMock = vi.hoisted(() => ({
  add: vi.fn()
}))

const clientPushMock = vi.hoisted(() => ({
  isClientPushEnabled: vi.fn(() => true),
  showClientPushWithImage: vi.fn()
}))

vi.mock('src/entities/chat-room', () => ({
  isRoomPrivate: (room: { chatKind: string }) => room.chatKind === 'direct',
  useChatRoom: () => chatRoomStoreMock
}))

vi.mock('src/entities/contact', () => ({
  useContact: () => ({ contactById: contactByIdMock })
}))

vi.mock('src/entities/known-user', () => ({
  useKnownUser: () => ({ knownUserById: knownUserByIdMock })
}))

vi.mock('src/entities/media-file', () => ({
  useMedia: () => mediaMock
}))

vi.mock('src/entities/setting', () => ({
  useAppSound: () => appSoundMock,
  useSettings: () => ({ settings: settingsMock })
}))

vi.mock('src/entities/system', () => ({
  useSystem: () => systemMock
}))

vi.mock('src/entities/user', () => ({
  useUser: () => userMock
}))

vi.mock('src/features/room-call-session', () => ({
  ROOM_CALL_SESSION_I18N: {
    incomingGroupRoomCallBrowserPush: 'incomingGroupRoomCallBrowserPush',
    incomingPrivateRoomCallBrowserPush: 'incomingPrivateRoomCallBrowserPush',
    unknownRoom: 'unknownRoom'
  }
}))

vi.mock('src/shared/lib', () => ({
  isClientPushEnabled: clientPushMock.isClientPushEnabled,
  showClientPushWithImage: clientPushMock.showClientPushWithImage,
  useAppToast: () => toastMock,
  useI18n: () => ({
    t: (key: string, params?: { title?: string }) => (params?.title ? `${key}:${params.title}` : key)
  })
}))

const { useRoomCallNotification } = await import('./use-room-call-notification.model')

const createNotificationGroupSettings = () => ({
  toast: true,
  sound: true,
  vibration: true,
  browserPush: true,
  nativePush: true
})

const createNotificationSettings = () => ({
  enabled: true,
  general: createNotificationGroupSettings(),
  messages: createNotificationGroupSettings(),
  calls: createNotificationGroupSettings(),
  groupCalls: {
    ...createNotificationGroupSettings(),
    sound: false,
    vibration: false
  },
  invites: createNotificationGroupSettings()
})

const createStartedRoomCallPayload = (): EventRoomCallStarted => ({
  roomCall: {
    id: 'room-call-1',
    roomId: 'group-room-1',
    initiatorId: 'initiator-user',
    mediaKind: 'video',
    status: 'calling',
    calledAt: 100,
    finishedAt: undefined,
    participants: []
  }
})

describe('useRoomCallNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    settingsMock.value = {
      notifications: createNotificationSettings()
    }

    chatRoomStoreMock.getById.mockReturnValue({
      id: 'group-room-1',
      chatKind: 'group',
      chatName: 'Product Studio',
      isMuted: false
    })

    contactByIdMock.value = new Map([
      [
        'initiator-user',
        {
          avatarId: 'avatar-1',
          nickname: 'Maya'
        }
      ]
    ])
    knownUserByIdMock.value = new Map()
    mediaMock.get.mockReturnValue(undefined)
    userMock.user.value = {
      id: 'current-user'
    }
    systemMock.hasInteracted.value = true
  })

  it('shows an in-app toast for a group room call when notifications allow it', () => {
    useRoomCallNotification().notifyStartedRoomCall(createStartedRoomCallPayload())

    expect(toastMock.add).toHaveBeenCalledWith(
      {
        title: 'Product Studio',
        content: 'incomingGroupRoomCallBrowserPush:Product Studio'
      },
      'message'
    )
  })

  it('treats a missing legacy group call toast setting as enabled', () => {
    const groupCalls = settingsMock.value.notifications.groupCalls as Partial<
      typeof settingsMock.value.notifications.groupCalls
    >
    delete groupCalls.toast

    useRoomCallNotification().notifyStartedRoomCall(createStartedRoomCallPayload())

    expect(toastMock.add).toHaveBeenCalledWith(
      {
        title: 'Product Studio',
        content: 'incomingGroupRoomCallBrowserPush:Product Studio'
      },
      'message'
    )
  })

  it('does not show an in-app toast when group call toasts are disabled', () => {
    settingsMock.value.notifications.groupCalls.toast = false

    useRoomCallNotification().notifyStartedRoomCall(createStartedRoomCallPayload())

    expect(toastMock.add).not.toHaveBeenCalled()
  })
})
