import { MAIN_PAGE_ROUTES } from 'src/shared/config'

export const isNavBtnActive = (id: string, isExactActive: boolean, routePath: string) =>
  isExactActive || (id === 'settings' && routePath.startsWith(MAIN_PAGE_ROUTES.settings))

export const getBadgeValue = (
  id: string,
  unreadInfoNotificationQuantity?: number,
  unreadMessagesQuantity?: number
) => {
  if (id === 'settings') return unreadInfoNotificationQuantity || undefined
  if (id === 'chat-rooms') return unreadMessagesQuantity || undefined
}
