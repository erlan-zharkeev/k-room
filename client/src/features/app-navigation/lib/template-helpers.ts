import { APP_PAGE_ROUTES } from '../config/constants'

export const isNavBtnActive = (id: string, isExactActive: boolean, routePath: string) =>
  isExactActive ||
  (id === 'chat-rooms' && routePath.startsWith(APP_PAGE_ROUTES.chatRooms)) ||
  (id === 'settings' && routePath.startsWith(APP_PAGE_ROUTES.settings))

export const getBadgeValue = (
  id: string,
  unreadMessagesQuantity?: number,
  invitationsQuantity?: number,
  settingsWarningBadgeValue?: string
) => {
  if (id === 'chat-rooms') return unreadMessagesQuantity || undefined
  if (id === 'contacts') return invitationsQuantity || undefined
  if (id === 'settings') return settingsWarningBadgeValue
}
