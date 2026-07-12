import type { RoomCall } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref, shallowRef, type Ref } from 'vue'

const roomCallStoreMock = vi.hoisted(() => ({
  merge: vi.fn(),
  roomCalls: undefined as unknown as Ref<RoomCall[]>
}))
const roomCallSessionMock = vi.hoisted(() => ({
  joinRoomCall: vi.fn(),
  leaveRoomCall: vi.fn(),
  sendRoomCallQuickCommand: vi.fn(),
  setRoomCallHandRaised: vi.fn(),
  startRoomCall: vi.fn(),
  updateRoomCallMediaState: vi.fn()
}))
const localMediaMock = vi.hoisted(() => ({
  startRoomCallLocalMedia: vi.fn(),
  stopRoomCallLocalMedia: vi.fn()
}))
const peerManagerMock = vi.hoisted(() => ({
  connectRoomCallPeers: vi.fn(),
  resetRoomCallPeers: vi.fn(),
  syncRoomCallPeerTracks: vi.fn()
}))
const toastMock = vi.hoisted(() => ({ add: vi.fn() }))

vi.mock('@vueuse/core', () => ({
  createGlobalState: (factory: () => unknown) => factory
}))
vi.mock('vue', async (importOriginal) => {
  const vue = await importOriginal<typeof import('vue')>()

  return {
    ...vue,
    onBeforeUnmount: vi.fn(),
    onMounted: vi.fn()
  }
})
vi.mock('src/entities/chat-room', () => ({
  useChatRoom: () => ({ isPrivate: vi.fn(() => false) })
}))
vi.mock('src/entities/room-call', () => ({
  useRoomCall: () => roomCallStoreMock
}))
vi.mock('src/entities/setting', () => ({
  useAppSound: () => ({
    playAppSound: vi.fn(),
    startLoopAppSound: vi.fn(),
    stopAppSound: vi.fn()
  }),
  useSettings: () => ({
    settings: ref({
      notifications: {
        calls: { sound: false },
        enabled: false,
        general: { sound: false }
      }
    }),
    setByPath: vi.fn()
  })
}))
vi.mock('src/entities/system', () => ({
  useSystem: () => ({ hasInteracted: ref(false) })
}))
vi.mock('src/entities/user', () => ({
  useUser: () => ({ user: ref({ id: 'user-1' }) })
}))
vi.mock('src/shared/api', () => ({
  API_I18N: { operationFailed: 'operationFailed' },
  setClientUpdateReloadBlock: vi.fn()
}))
vi.mock('src/shared/lib', () => ({
  defineI18n: (_namespace: string, messages: Record<string, unknown>) =>
    Object.fromEntries(Object.keys(messages).map((key) => [key, key])),
  i18nFormatter: vi.fn(() => 'formatted'),
  log: vi.fn(),
  TOAST_I18N: { error: 'error' },
  useAppToast: () => toastMock,
  useI18n: () => ({ t: (key: string) => key })
}))
vi.mock('./room-call-signal-queue.model', () => ({
  createRoomCallSignalQueue: () => ({
    clearRoomCallSignalQueue: vi.fn(),
    flushRoomCallSignals: vi.fn(() => []),
    queueJoiningRoomCallSignal: vi.fn(),
    startJoiningRoomCall: vi.fn(),
    stopJoiningRoomCall: vi.fn()
  })
}))
vi.mock('./use-room-call-local-media.model', () => ({
  useRoomCallLocalMedia: () => ({
    audioStream: shallowRef(null),
    isAudioLoading: ref(false),
    isScreenLoading: ref(false),
    isVideoLoading: ref(false),
    localMediaState: ref({ audio: false, screen: false, video: false }),
    screenStream: shallowRef(null),
    setAudioEnabled: vi.fn(),
    setVideoEnabled: vi.fn(),
    startAudio: vi.fn(),
    startRoomCallLocalMedia: localMediaMock.startRoomCallLocalMedia,
    startScreen: vi.fn(),
    startVideo: vi.fn(),
    stopRoomCallLocalMedia: localMediaMock.stopRoomCallLocalMedia,
    stopScreen: vi.fn(),
    videoFacingMode: ref(null),
    videoStream: shallowRef(null)
  })
}))
vi.mock('./use-room-call-peer-manager.model', () => ({
  useRoomCallPeerManager: () => ({
    connectRoomCallPeers: peerManagerMock.connectRoomCallPeers,
    connectionQualityByUserId: ref({}),
    handleRoomCallSignalReceived: vi.fn(),
    remoteStreamsByUserId: ref({}),
    resetRoomCallPeers: peerManagerMock.resetRoomCallPeers,
    setRoomCallPeerRtcConfiguration: vi.fn(),
    syncRoomCallPeerTracks: peerManagerMock.syncRoomCallPeerTracks
  })
}))
vi.mock('./use-room-call-quick-command-monitor.model', () => ({
  useRoomCallQuickCommandMonitor: () => ({
    disposeRoomCallQuickCommandMonitor: vi.fn(),
    initializeRoomCallQuickCommandMonitor: vi.fn()
  })
}))
vi.mock('./use-room-call-quick-command-sync.model', () => ({
  useRoomCallQuickCommandSync: () => ({
    handRaisedByUserId: ref({}),
    resetRoomCallQuickCommands: vi.fn(),
    syncInitialRoomCallParticipantQuickCommandStates: vi.fn(),
    syncRoomCallHandRaisedUpdated: vi.fn(),
    syncRoomCallQuickCommandReceived: vi.fn(),
    temporaryQuickCommandByUserId: ref({})
  })
}))
vi.mock('./use-room-call-runtime-state.model', () => ({
  useRoomCallRuntimeState: () => ({
    resetRoomCallRuntimeState: vi.fn(),
    syncRoomCallRuntimeState: vi.fn()
  })
}))
vi.mock('./use-room-call-session.model', () => ({
  useRoomCallSession: () => roomCallSessionMock
}))
vi.mock('./use-room-call-signal-monitor.model', () => ({
  useRoomCallSignalMonitor: () => ({
    disposeRoomCallSignalMonitor: vi.fn(),
    initializeRoomCallSignalMonitor: vi.fn()
  })
}))

const { useActiveRoomCallSession } = await import('./use-active-room-call-session.model')

const activeRoomCall: RoomCall = {
  id: 'call-1',
  roomId: 'room-1',
  initiatorId: 'user-2',
  calledAt: 100,
  startedAt: 200,
  status: 'in-progress',
  mediaKind: 'audio',
  participants: [
    {
      userId: 'user-1',
      socketId: 'socket-1',
      joinedAt: 200,
      mediaState: {
        audio: true,
        video: false,
        screen: false
      }
    }
  ]
}

describe('active room call session join', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    roomCallStoreMock.roomCalls = ref([])
    roomCallStoreMock.merge.mockImplementation(async (roomCall: RoomCall) => {
      roomCallStoreMock.roomCalls.value = [roomCall]
    })
    roomCallSessionMock.joinRoomCall.mockResolvedValue({
      ok: true,
      payload: {
        participantQuickCommandStateByUserId: {},
        roomCall: activeRoomCall,
        roomCallId: activeRoomCall.id,
        rtcConfiguration: {}
      }
    })
    roomCallSessionMock.leaveRoomCall.mockResolvedValue(true)
    roomCallSessionMock.updateRoomCallMediaState.mockResolvedValue(true)
    localMediaMock.startRoomCallLocalMedia.mockResolvedValue(undefined)
    peerManagerMock.connectRoomCallPeers.mockResolvedValue(undefined)
    peerManagerMock.syncRoomCallPeerTracks.mockResolvedValue(undefined)
  })

  it('silently cancels joining when the call finishes while local media is starting', async () => {
    let resolveLocalMedia: (() => void) | undefined
    const localMediaStarted = new Promise<void>((resolve) => {
      resolveLocalMedia = resolve
    })

    localMediaMock.startRoomCallLocalMedia.mockReturnValue(localMediaStarted)

    const { joinActiveRoomCall } = useActiveRoomCallSession()
    const joinTask = joinActiveRoomCall(activeRoomCall.id, 'audio')

    await vi.waitFor(() => expect(localMediaMock.startRoomCallLocalMedia).toHaveBeenCalledOnce())

    roomCallStoreMock.roomCalls.value = [
      {
        ...activeRoomCall,
        status: 'finished',
        finishedAt: 300
      }
    ]
    await nextTick()
    resolveLocalMedia?.()

    await expect(joinTask).resolves.toBeNull()
    expect(toastMock.add).not.toHaveBeenCalled()
    expect(roomCallSessionMock.leaveRoomCall).not.toHaveBeenCalled()
    expect(peerManagerMock.connectRoomCallPeers).not.toHaveBeenCalled()
    expect(localMediaMock.stopRoomCallLocalMedia).toHaveBeenCalled()
  })

  it('shows the media permission error only when local media startup fails', async () => {
    localMediaMock.startRoomCallLocalMedia.mockRejectedValue(new DOMException('Permission denied', 'NotAllowedError'))

    const { joinActiveRoomCall } = useActiveRoomCallSession()

    await expect(joinActiveRoomCall(activeRoomCall.id, 'audio')).resolves.toBeNull()
    expect(roomCallSessionMock.leaveRoomCall).toHaveBeenCalledWith(activeRoomCall.id, 'left')
    expect(toastMock.add).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'roomCallJoinFailed',
        type: 'error'
      })
    )
  })

  it('shows the connection error when peer setup fails after media startup', async () => {
    peerManagerMock.connectRoomCallPeers.mockRejectedValue(new Error('Peer setup failed'))

    const { joinActiveRoomCall } = useActiveRoomCallSession()

    await expect(joinActiveRoomCall(activeRoomCall.id, 'audio')).resolves.toBeNull()
    expect(roomCallSessionMock.leaveRoomCall).toHaveBeenCalledWith(activeRoomCall.id, 'left')
    expect(toastMock.add).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'roomCallConnectionFailed',
        type: 'error'
      })
    )
  })
})
