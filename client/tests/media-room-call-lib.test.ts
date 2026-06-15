import { ROOM_CALL_LEAVE_REASON, ROOM_CALL_MEDIA_KIND, ROOM_CALL_STATUS, type RoomCall } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@nmorph/nmorph-ui-kit', () => ({
  NmorphIconMonitor: 'monitor-icon',
  NmorphIconPhone: 'phone-icon',
  NmorphIconVideoCamera: 'video-icon'
}))

const mediaSyncQueueModule = await import('../src/entities/media-file/lib/media-sync-queue')
const roomCallSyncModule = await import('../src/entities/room-call/lib/room-call-sync')
const trimMediaCacheModule = await import('../src/entities/media-file/lib/trim-media-cache')
const roomCallHistoryModule = await import('../src/pages/calls/lib/room-call-history')
const { allowMediaSyncQueue, blockMediaSyncQueue, enqueueMediaSync } = mediaSyncQueueModule
const { applyRoomCallEnded, applyRoomCallJoined, applyRoomCallLeft, applyRoomCallMediaStateUpdated } =
  roomCallSyncModule
const { trimMediaCache } = trimMediaCacheModule
const { resolveRoomCallHistoryMediaI18n, resolveRoomCallHistoryStatusKind, sortRoomCallHistoryItems } =
  roomCallHistoryModule

const createRoomCall = (): RoomCall =>
  ({
    id: 'call-1',
    roomId: 'room-1',
    initiatorId: 'user-1',
    calledAt: 100,
    status: ROOM_CALL_STATUS.CALLING,
    mediaKind: ROOM_CALL_MEDIA_KIND.VIDEO,
    participants: [
      {
        userId: 'user-1',
        socketId: 'socket-1',
        joinedAt: 100,
        mediaState: {
          audio: true,
          video: true,
          screen: false
        }
      }
    ]
  } as RoomCall)

describe('media and room call lib helpers', () => {
  beforeEach(() => {
    blockMediaSyncQueue()
    allowMediaSyncQueue()
  })

  it('deduplicates in-flight media sync by media id', async () => {
    let releaseTask = () => {}
    const task = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          releaseTask = resolve
        })
    )

    const first = enqueueMediaSync('media-1', task)
    const second = enqueueMediaSync('media-1', task)

    await Promise.resolve()
    expect(task).toHaveBeenCalledTimes(1)

    releaseTask()
    await Promise.all([first, second])

    expect(task).toHaveBeenCalledTimes(1)
  })

  it('resolves blocked media sync queue without running pending task', async () => {
    const task = vi.fn()

    blockMediaSyncQueue()
    await enqueueMediaSync('media-1', task)
    allowMediaSyncQueue()

    expect(task).not.toHaveBeenCalled()
  })

  it('trims oldest cached media records until record threshold or byte target is reached', async () => {
    const deleteMediaRecords = vi.fn()
    const loadMediaRecords = vi.fn().mockResolvedValue([
      { id: 'new-small', lastChecked: 30, blob: { size: 1 } },
      { id: 'old-small', lastChecked: 10, blob: { size: 1 } },
      { id: 'old-large', lastChecked: 10, blob: { size: 999 } },
      { id: 'missing-blob', lastChecked: 0, blob: null }
    ])

    await expect(trimMediaCache({ deleteMediaRecords, loadMediaRecords })).resolves.toEqual({ trimmed: true })
    expect(deleteMediaRecords).toHaveBeenCalledWith(['old-large', 'old-small', 'new-small'])
  })

  it('applies room call live updates to cached room call object', () => {
    const roomCall = createRoomCall()
    const joinedParticipant = {
      userId: 'user-2',
      socketId: 'socket-2',
      joinedAt: 200,
      mediaState: {
        audio: true,
        video: false,
        screen: false
      }
    }

    applyRoomCallJoined(roomCall, {
      roomCallId: 'call-1',
      participant: joinedParticipant,
      startedAt: 200
    })
    applyRoomCallMediaStateUpdated(roomCall, {
      roomCallId: 'call-1',
      userId: 'user-2',
      mediaState: {
        audio: false,
        video: false,
        screen: true
      }
    })
    applyRoomCallLeft(roomCall, {
      roomCallId: 'call-1',
      userId: 'user-2',
      reason: ROOM_CALL_LEAVE_REASON.LEFT,
      leftAt: 300
    })
    applyRoomCallEnded(roomCall, {
      roomCallId: 'call-1',
      finishedAt: 400
    })

    expect(roomCall.status).toBe(ROOM_CALL_STATUS.FINISHED)
    expect(roomCall.startedAt).toBe(200)
    expect(roomCall.finishedAt).toBe(400)
    expect(roomCall.participants[1]).toMatchObject({
      userId: 'user-2',
      leftAt: 300,
      mediaState: {
        audio: false,
        video: false,
        screen: true
      }
    })
  })

  it('sorts active room calls first and newer history before older history', () => {
    expect(
      sortRoomCallHistoryItems([
        { id: 'old', isActive: false, calledAt: 1 },
        { id: 'active', isActive: true, calledAt: 0 },
        { id: 'new', isActive: false, calledAt: 3 }
      ] as never)
    ).toEqual([
      { id: 'active', isActive: true, calledAt: 0 },
      { id: 'new', isActive: false, calledAt: 3 },
      { id: 'old', isActive: false, calledAt: 1 }
    ])
  })

  it('resolves room call history status and media labels', () => {
    const activeCall = createRoomCall()
    const missedCall = {
      ...createRoomCall(),
      finishedAt: 300,
      status: ROOM_CALL_STATUS.FINISHED
    }

    expect(resolveRoomCallHistoryStatusKind(activeCall)).toBe('active')
    expect(resolveRoomCallHistoryStatusKind(missedCall)).toBe('missed')
    expect(resolveRoomCallHistoryMediaI18n(ROOM_CALL_MEDIA_KIND.AUDIO).en).toBe('Audio')
    expect(resolveRoomCallHistoryMediaI18n(ROOM_CALL_MEDIA_KIND.VIDEO).en).toBe('Video')
    expect(resolveRoomCallHistoryMediaI18n(ROOM_CALL_MEDIA_KIND.SCREEN).en).toBe('Screen')
  })
})
