import { buildAvatarId } from 'global-shared'
import { computed, type Ref } from 'vue'

import type { AppUserPickerProps } from './types'

export const useAppUserPicker = (props: AppUserPickerProps, selectedUserIds: Ref<string[]>) => {
  const userItems = computed(() =>
    props.items.map((item) => ({
      ...item,
      imageId: item.imageId ?? buildAvatarId(item.id)
    }))
  )

  const selectUsers = (userIds: string[]) => {
    const nextUserIds = props.multiple ? userIds : userIds.slice(-1)

    selectedUserIds.value = props.maxSelected ? nextUserIds.slice(0, props.maxSelected) : nextUserIds
  }

  return {
    userItems,
    selectUsers
  }
}
