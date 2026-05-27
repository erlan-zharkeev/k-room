export const ROOM_MESSAGES_PAGE_LIMIT = 30
export const ROOM_MESSAGES_PRELOAD_EDGE_ITEMS = 20
export const MESSAGE_READ_VISIBILITY_RATIO = 0.5
export const MESSAGE_RANGE_GAP_HEIGHT = 24
export const MESSAGE_VIRTUAL_ESTIMATED_HEIGHT = 96
export const MESSAGE_VIRTUAL_GAP = 4
export const MESSAGE_VIRTUAL_OVERSCAN = 8
export const MESSAGE_BACK_TO_BOTTOM_VISIBLE_OFFSET = 120
export const MESSAGE_CONTEXT_MENU_ACTION = {
  COPY_TEXT: 'copy-text',
  EDIT_MESSAGE: 'edit-message',
  REACTION_PICKER: 'reaction-picker',
  PIN_MESSAGE: 'pin-message',
  UNPIN_MESSAGE: 'unpin-message',
  DELETE_MESSAGE: 'delete-message'
} as const
