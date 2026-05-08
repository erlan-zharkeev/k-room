import { APP_PAGE_ROUTES } from 'src/shared/config'

export const isNavBtnActive = (id: string, isExactActive: boolean, routePath: string) =>
  isExactActive || (id === 'settings' && routePath.startsWith(APP_PAGE_ROUTES.settings))

export const getBadgeValue = (id: string, unreadInfoNotificationQuantity?: number, unreadMessagesQuantity?: number) => {
  if (id === 'info-notifications') return unreadInfoNotificationQuantity || undefined
  if (id === 'chat-rooms') return unreadMessagesQuantity || undefined
}
