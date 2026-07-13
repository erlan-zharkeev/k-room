import type { EventLeaveChatRoom } from 'global-shared'
import { computed, ref, toRef, watch, type Ref } from 'vue'

import { isRoomAdmin, useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useUser } from 'src/entities/user'
import { useSocketAction } from 'src/shared/api'
import type { AppProfilePickerItem } from 'src/shared/ui'

import type { ChatRoomLeaveDialogProps } from '../config/types'

import { useChatRoomPermissions } from './use-chat-room-permissions.model'

export const useChatRoomLeave = (props: ChatRoomLeaveDialogProps, isLeaveChatRoomDialogOpen: Ref<boolean>) => {
  const item = toRef(props, 'item')
  const { getById } = useChatRoom()
  const { contactById } = useContact()
  const { knownUserById } = useKnownUser()
  const { emitSocketAction } = useSocketAction()
  const { user } = useUser()
  const selectedNewAdminIds = ref<string[]>([])
  const isLeavingChatRoom = ref(false)
  const { canShowLeaveChatRoom, isCurrentUserChatRoomAdmin } = useChatRoomPermissions(item)
  const isCurrentUserLastChatRoomMember = computed(() => {
    const room = getById(item.value.id)

    return Boolean(room && room.users.length === 1 && room.users[0] === user.value.id)
  })
  const shouldOfferNewAdminSelection = computed(
    () => isCurrentUserChatRoomAdmin.value && !isCurrentUserLastChatRoomMember.value
  )
  const newAdminItems = computed(() => {
    const room = getById(item.value.id)

    if (!room) {
      return []
    }

    return room.users.reduce<AppProfilePickerItem[]>((items, userId) => {
      if (isRoomAdmin(item.value, userId)) return items

      const userData = contactById.value.get(userId) ?? knownUserById.value.get(userId)

      if (!userData) return items

      items.push({
        id: userId,
        title: userData.nickname
      })

      return items
    }, [])
  })
  const hasNewAdminCandidates = computed(() => newAdminItems.value.length > 0)

  const isReadyToLeaveChatRoom = computed(() => canShowLeaveChatRoom.value && !isLeavingChatRoom.value)
  const canLeaveChatRoom = computed(() => isReadyToLeaveChatRoom.value)

  const closeLeaveChatRoomDialog = () => {
    isLeaveChatRoomDialogOpen.value = false
  }

  const leaveChatRoom = () => {
    if (!canLeaveChatRoom.value) return

    const nextAdminId = selectedNewAdminIds.value[0]
    const payload: EventLeaveChatRoom = {
      roomId: item.value.id,
      ...(nextAdminId ? { nextAdminId } : {})
    }

    isLeavingChatRoom.value = true
    void emitSocketAction('leave-chat-room', payload, {
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
    hasNewAdminCandidates,
    isCurrentUserChatRoomAdmin,
    isLeavingChatRoom,
    leaveChatRoom,
    newAdminItems,
    selectedNewAdminIds,
    shouldOfferNewAdminSelection
  }
}
