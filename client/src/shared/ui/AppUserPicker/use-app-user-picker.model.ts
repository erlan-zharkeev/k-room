import { computed, type Ref } from 'vue'

import { getAvatarId } from 'src/shared/lib'

import type { IAppUserPickerProps } from './types'

export const useAppUserPicker = (props: IAppUserPickerProps, selectedUserIds: Ref<string[]>) => {
  const userItems = computed(() =>
    props.items.map((item) => ({
      ...item,
      imageId: item.imageId ?? getAvatarId(item.id)
    }))
  )

  const selectUsers = (userIds: string[]) => {
    selectedUserIds.value = props.multiple ? userIds : userIds.slice(-1)
  }

  return {
    userItems,
    selectUsers
  }
}
