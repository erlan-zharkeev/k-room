import { isString } from 'global-shared'
import sumBy from 'lodash/sumBy'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useMediaDevicePermission, useStorageEstimate } from 'src/shared/lib'

import { APP_PAGE_ROUTES } from '../config/constants'

export const useAppNavigation = () => {
  const route = useRoute()
  const { chatRooms } = useChatRoom()
  const { invitationsQuantity } = useContact()
  const { isStorageUsageWarning } = useStorageEstimate()
  const { hasMediaDevicePermissionWarning } = useMediaDevicePermission()

  const selectedSettingsId = computed(() => {
    const { settingsId } = route.params
    return isString(settingsId) && settingsId ? settingsId : 'account'
  })
  const routePath = computed(() => route.path)
  const unreadMessagesQuantity = computed(() => sumBy(chatRooms.value, 'unreadMessagesQuantity'))
  const hasSettingsWarning = computed(() => isStorageUsageWarning.value || hasMediaDevicePermissionWarning.value)
  const buildNavigationRoute = (itemId: string, itemPath: string, footer?: boolean) => {
    const path = itemId === 'settings' ? `${APP_PAGE_ROUTES.settings}/${selectedSettingsId.value}` : itemPath

    if (!footer) return path

    return { path, query: { ...route.query, view: 'content-navigation' } }
  }

  return {
    routePath,
    buildNavigationRoute,
    unreadMessagesQuantity,
    invitationsQuantity,
    hasSettingsWarning
  }
}
