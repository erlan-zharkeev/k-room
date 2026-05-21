import type { IEventLeaveChatRoom } from 'global-shared'
import { computed, ref, toRef, watch, type Ref } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useSocketAction } from 'src/shared/api'
import type { IAppUserPickerItem } from 'src/shared/ui'

import type { IChatRoomLeaveDialogProps } from '../config/types'

import { useChatRoomPermissions } from './use-chat-room-permissions.model'

export const useChatRoomLeave = (props: IChatRoomLeaveDialogProps, isLeaveChatRoomDialogOpen: Ref<boolean>) => {
  const item = toRef(props, 'item')
  const { getById } = useChatRoom()
  const { getByIds } = useContact()
  const { emitSocketAction } = useSocketAction()
  const selectedNewAdminIds = ref<string[]>([])
  const isLeavingChatRoom = ref(false)
  const { canShowLeaveChatRoom, isCurrentUserChatRoomAdmin } = useChatRoomPermissions(item)
  const newAdminItems = computed(() => {
    const room = getById(item.value.id)
    const userDataMap = new Map(getByIds(room?.users ?? []).map((userData) => [userData.id, userData]))

    return (room?.users ?? []).reduce<IAppUserPickerItem[]>((items, userId) => {
      if (userId === item.value.adminId) return items

      const userData = userDataMap.get(userId)

      items.push({
        id: userId,
        nickname: userData?.nickname ?? userId
      })

      return items
    }, [])
  })
  const canLeaveChatRoom = computed(
    () =>
      canShowLeaveChatRoom.value &&
      !isLeavingChatRoom.value &&
      (!isCurrentUserChatRoomAdmin.value || selectedNewAdminIds.value.length === 1)
  )

  const closeLeaveChatRoomDialog = () => {
    isLeaveChatRoomDialogOpen.value = false
  }

  const leaveChatRoom = () => {
    if (!canLeaveChatRoom.value) return

    const nextAdminId = selectedNewAdminIds.value[0]
    const payload: IEventLeaveChatRoom = {
      roomId: item.value.id,
      ...(isCurrentUserChatRoomAdmin.value ? { nextAdminId } : {})
    }

    isLeavingChatRoom.value = true
    void emitSocketAction<IEventLeaveChatRoom>('leave-chat-room', payload, {
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
