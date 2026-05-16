import { isString } from 'lodash'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useMessage } from 'src/entities/message'

export const useAppNavigation = () => {
  const route = useRoute()
  const { chatRooms } = useChatRoom()
  const { invitationsQuantity } = useContact()
  const { messages } = useMessage()

  const selectedSettingsId = computed(() => {
    const { settingsId } = route.params
    return isString(settingsId) && settingsId ? settingsId : 'account'
  })
  const routePath = computed(() => route.path)
  const allRoomMessageIds = computed(() => new Set(chatRooms.value.flatMap((room) => room.messages)))
  const unreadMessagesQuantity = computed(
    () =>
      messages.value.filter(
        ({ id, isSelf, status }) => allRoomMessageIds.value.has(id) && !isSelf && status === 'delivered'
      ).length
  )

  return {
    routePath,
    selectedSettingsId,
    unreadMessagesQuantity,
    invitationsQuantity
  }
}
