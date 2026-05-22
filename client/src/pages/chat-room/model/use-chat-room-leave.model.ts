import type { EventLeaveChatRoom } from 'global-shared'
import { computed, ref, toRef, watch, type Ref } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { useSocketAction } from 'src/shared/api'
import type { AppUserPickerItem } from 'src/shared/ui'

import type { ChatRoomLeaveDialogProps } from '../config/types'

import { useChatRoomPermissions } from './use-chat-room-permissions.model'
import { useChatRoomUserLookup } from './use-chat-room-user-lookup.model'

export const useChatRoomLeave = (props: ChatRoomLeaveDialogProps, isLeaveChatRoomDialogOpen: Ref<boolean>) => {
  const item = toRef(props, 'item')
  const { getById } = useChatRoom()
  const { getUserById } = useChatRoomUserLookup()
  const { emitSocketAction } = useSocketAction()
  const selectedNewAdminIds = ref<string[]>([])
  const isLeavingChatRoom = ref(false)
  const { canShowLeaveChatRoom, isCurrentUserChatRoomAdmin } = useChatRoomPermissions(item)
  const newAdminItems = computed(() => {
    const room = getById(item.value.id)
    const roomUserIds = room?.users ?? []

    return roomUserIds.reduce<AppUserPickerItem[]>((items, userId) => {
      if (userId === item.value.adminId) return items

      const userData = getUserById(userId)

      if (!userData) return items

      items.push({
        id: userId,
        nickname: userData.nickname
      })

      return items
    }, [])
  })

  const isReadyToLeaveChatRoom = computed(() => canShowLeaveChatRoom.value && !isLeavingChatRoom.value)
  const canCurrentAdminLeaveChatRoom = computed(
    () => !isCurrentUserChatRoomAdmin.value || selectedNewAdminIds.value.length === 1
  )
  const canLeaveChatRoom = computed(() => isReadyToLeaveChatRoom.value && canCurrentAdminLeaveChatRoom.value)

  const closeLeaveChatRoomDialog = () => {
    isLeaveChatRoomDialogOpen.value = false
  }

  const leaveChatRoom = () => {
    if (!canLeaveChatRoom.value) return

    const nextAdminId = selectedNewAdminIds.value[0]
    const payload: EventLeaveChatRoom = {
      roomId: item.value.id,
      ...(isCurrentUserChatRoomAdmin.value ? { nextAdminId } : {})
    }

    isLeavingChatRoom.value = true
    void emitSocketAction<EventLeaveChatRoom>('leave-chat-room', payload, {
      onSettled: () => {
        isLeavingChatRoom.value = false
      }
    })
    closeLeaveChatRoomDialog()
  }

  watch(isLeaveChatRoomDialogOpen, (value) => {
    if (value) return

    selectedNewAdminIds.value = []
  })

  return {
    canLeaveChatRoom,
    closeLeaveChatRoomDialog,
    isCurrentUserChatRoomAdmin,
    isLeavingChatRoom,
    leaveChatRoom,
    newAdminItems,
    selectedNewAdminIds
  }
}
