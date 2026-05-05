import { MAIN_PAGE_I18N } from './i18n'

export const ROOM_MESSAGES_PAGE_LIMIT = 30
export const CONTACT_ONLINE_CHECK_INTERVAL_MS = 10_000
export const CONTACT_ONLINE_STATUS_TTL_MS = 30_000

export const MAIN_PAGE_CONTACT_SEARCH_DEBOUNCE_MS = 300

export const MESSAGE_VIRTUAL_ITEM_ESTIMATED_SIZE_PX = 74

export const MESSAGE_VIRTUAL_LIST_OVERSCAN = 12

export const MESSAGE_READ_VISIBILITY_THRESHOLD = 0.65

export const MESSAGE_SCROLL_SAVE_DEBOUNCE_MS = 250

export const MESSAGE_LOAD_MORE_SCROLL_TOP_PX = 48

export const MESSAGE_SCROLL_BOTTOM_THRESHOLD_PX = 72

export const MESSAGE_CONTEXT_MENU_WIDTH_PX = 340

export const MESSAGE_CONTEXT_MENU_HEIGHT_PX = 520

export const MESSAGE_CONTEXT_MENU_VIEWPORT_MARGIN_PX = 12

export const MAIN_PAGE_MESSAGE_ACTIONS = [
  {
    id: 'reply',
    label: MAIN_PAGE_I18N.replyMessage,
    icon: 'pi pi-reply',
    severity: 'secondary'
  },
  {
    id: 'forward',
    label: MAIN_PAGE_I18N.forwardMessage,
    icon: 'pi pi-arrow-up',
    severity: 'secondary'
  },
  {
    id: 'delete',
    label: MAIN_PAGE_I18N.deleteMessage,
    icon: 'pi pi-times',
    severity: 'danger'
  }
] as const
