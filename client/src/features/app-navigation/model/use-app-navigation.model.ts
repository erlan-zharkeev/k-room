import { isString } from 'lodash'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'

export const useAppNavigation = () => {
  const route = useRoute()
  const { chatRooms } = useChatRoom()
  const { invitationsQuantity } = useContact()

  const selectedSettingsId = computed(() => {
    const { settingsId } = route.params
    return isString(settingsId) && settingsId ? settingsId : 'account'
  })
  const routePath = computed(() => route.path)
  const unreadMessagesQuantity = computed(() =>
    chatRooms.value.reduce((quantity, room) => quantity + (room.unreadMessagesQuantity ?? 0), 0)
  )

  return {
    routePath,
    selectedSettingsId,
    unreadMessagesQuantity,
    invitationsQuantity
  }
}
