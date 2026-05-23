import { isString } from 'global-shared'
import sumBy from 'lodash/sumBy'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useMediaDevicePermission, useStorageEstimate } from 'src/shared/lib'

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

  return {
    routePath,
    selectedSettingsId,
    unreadMessagesQuantity,
    invitationsQuantity,
    hasSettingsWarning
  }
}
