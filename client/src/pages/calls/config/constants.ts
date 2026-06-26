import { NmorphIconMonitor, NmorphIconPhone, NmorphIconVideoCamera } from '@nmorph/nmorph-ui-kit'
import type { RoomCallMediaKind } from 'global-shared'
import type { Component } from 'vue'

import type { RoomCallHistoryStatusKind } from './types'

export const ROOM_CALL_HISTORY_SEARCH_DEBOUNCE_MS = 300

export const ROOM_CALL_HISTORY_STATUS_COLOR_BY_KIND = {
  active: 'var(--nmorph-warn-text-color)',
  finished: 'var(--nmorph-success-text-color)',
  missed: 'var(--nmorph-error-text-color)'
} as const satisfies Record<RoomCallHistoryStatusKind, string>

export const ROOM_CALL_HISTORY_MEDIA_ICON_BY_KIND = {
  audio: NmorphIconPhone,
  video: NmorphIconVideoCamera,
  screen: NmorphIconMonitor
} satisfies Record<RoomCallMediaKind, Component | string>
