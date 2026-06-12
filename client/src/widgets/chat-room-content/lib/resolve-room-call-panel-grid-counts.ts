import { ROOM_CALL_PANEL_GRID_ROWS_PER_COLUMN } from '../config/constants'

export const resolveRoomCallPanelGridColumnCount = (itemsCount: number) =>
  Math.max(1, Math.ceil(itemsCount / ROOM_CALL_PANEL_GRID_ROWS_PER_COLUMN))

export const resolveRoomCallPanelGridRowCount = (itemsCount: number) =>
  Math.min(ROOM_CALL_PANEL_GRID_ROWS_PER_COLUMN, Math.max(1, itemsCount))
