import { NmorphIconMonitor, NmorphIconPhone, NmorphIconVideoCamera } from '@nmorph/nmorph-ui-kit'
import { ROOM_CALL_MEDIA_KIND, type RoomCallMediaKind } from 'global-shared'
import type { Component } from 'vue'

export const ROOM_CALL_HISTORY_STATUS_KIND = {
  ACTIVE: 'active',
  FINISHED: 'finished',
  MISSED: 'missed'
} as const

export const ROOM_CALL_HISTORY_STATUS_COLOR_BY_KIND = {
  [ROOM_CALL_HISTORY_STATUS_KIND.ACTIVE]: 'var(--nmorph-warn-color)',
  [ROOM_CALL_HISTORY_STATUS_KIND.FINISHED]: 'var(--nmorph-success-color)',
  [ROOM_CALL_HISTORY_STATUS_KIND.MISSED]: 'var(--nmorph-error-color)'
} as const

export const ROOM_CALL_HISTORY_MEDIA_ICON_BY_KIND = {
  [ROOM_CALL_MEDIA_KIND.AUDIO]: NmorphIconPhone,
  [ROOM_CALL_MEDIA_KIND.VIDEO]: NmorphIconVideoCamera,
  [ROOM_CALL_MEDIA_KIND.SCREEN]: NmorphIconMonitor
} satisfies Record<RoomCallMediaKind, Component | string>
