import type { RoomCallVideoFacingMode } from './types'

export const ROOM_CALL_VIDEO_FACING_MODE_VALUES = [
  'environment',
  'left',
  'right',
  'user'
] as const satisfies readonly RoomCallVideoFacingMode[]
