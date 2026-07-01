import { getAppSettingsPath, isString } from 'global-shared'
import sumBy from 'lodash/sumBy'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useSettings, type ContentTab } from 'src/entities/setting'
import { useMediaDevicePermission, useStorageEstimate } from 'src/shared/lib'

import { getChatRoomContentRoutePath } from '../lib/routes'

export const useAppNavigation = () => {
  const route = useRoute()
  const { chatRooms } = useChatRoom()
  const { invitationsQuantity } = useContact()
  const { settings } = useSettings()
  const { isStorageUsageWarning } = useStorageEstimate()
  const { hasMediaDevicePermissionWarning } = useMediaDevicePermission()

  const selectedSettingsId = computed(() => {
    const { settingsId } = route.params
    return isString(settingsId) && settingsId ? settingsId : settings.value.settingsContentId || 'account'
  })
  const routePath = computed(() => route.path)
  const unreadMessagesQuantity = computed(() => sumBy(chatRooms.value, 'unreadMessagesQuantity'))
  const hasSettingsWarning = computed(() => isStorageUsageWarning.value || hasMediaDevicePermissionWarning.value)
  const buildNavigationRoute = (itemId: ContentTab, itemPath: string, footer?: boolean) => {
    const chatRoomContentPath = getChatRoomContentRoutePath(itemId, settings.value.chatRoomId)
    const path = itemId === 'settings' ? getAppSettingsPath(selectedSettingsId.value) : chatRoomContentPath ?? itemPath

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
