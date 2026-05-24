import { computed, type Ref } from 'vue'

import type { AppUserPickerModelProps } from './types'

export const useAppUserPicker = (props: AppUserPickerModelProps, selectedUserIds: Ref<string[]>) => {
  const userItems = computed(() =>
    props.items.map((item) => ({
      ...item,
      isLocked: props.lockedIds.includes(item.id)
    }))
  )

  const selectUsers = (userIds: string[]) => {
    const unlockedUserIds = userIds.filter((userId) => !props.lockedIds.includes(userId))
    const nextUserIds = props.multiple ? [...props.lockedIds, ...unlockedUserIds] : userIds.slice(-1)

    selectedUserIds.value = props.maxSelected ? nextUserIds.slice(0, props.maxSelected) : nextUserIds
  }

  return {
    userItems,
    selectUsers
  }
}
