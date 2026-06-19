import { type RoomCall } from 'global-shared'
import { describe, expect, it, vi } from 'vitest'

import { createRoomCallTestFixture } from 'src/entities/room-call'

import { CALLS_PAGE_I18N } from '../config/i18n'

import {
  resolveRoomCallHistoryMediaI18n,
  resolveRoomCallHistoryStatusKind,
  sortRoomCallHistoryItems
} from './room-call-history'

vi.mock('src/shared/lib', () => ({
  defineI18n: (namespace: string, source: Record<string, unknown>) =>
    Object.fromEntries(Object.keys(source).map((key) => [key, `${namespace}.${key}`])),
  db: {
    'room-calls': {}
  },
  dexieCollectionStore: () => ({
    use: () => ({ value: [] })
  })
}))

vi.mock('src/shared/api', () => ({
  registerSocketEventListeners: () => vi.fn()
}))

vi.mock('@nmorph/nmorph-ui-kit', () => ({
  NmorphIconMonitor: 'monitor-icon',
  NmorphIconPhone: 'phone-icon',
  NmorphIconVideoCamera: 'video-icon'
}))

describe('room call history helpers', () => {
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
    const activeCall = createRoomCallTestFixture()
    const missedCall: RoomCall = {
      ...createRoomCallTestFixture(),
      finishedAt: 300,
      status: 'finished'
    }

    expect(resolveRoomCallHistoryStatusKind(activeCall)).toBe('active')
    expect(resolveRoomCallHistoryStatusKind(missedCall)).toBe('missed')
    expect(resolveRoomCallHistoryMediaI18n('audio')).toBe(CALLS_PAGE_I18N.audioCall)
    expect(resolveRoomCallHistoryMediaI18n('video')).toBe(CALLS_PAGE_I18N.videoCall)
    expect(resolveRoomCallHistoryMediaI18n('screen')).toBe(CALLS_PAGE_I18N.screenCall)
  })
})
