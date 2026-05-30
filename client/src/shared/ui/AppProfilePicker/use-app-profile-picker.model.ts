import { computed, type Ref } from 'vue'

import type { AppProfilePickerModelProps } from './types'

export const useAppProfilePicker = (props: AppProfilePickerModelProps, selectedProfileIds: Ref<string[]>) => {
  const profileItems = computed(() =>
    props.items.map((item) => ({
      ...item,
      isLocked: props.lockedIds.includes(item.id)
    }))
  )

  const selectProfiles = (profileIds: string[]) => {
    const unlockedProfileIds = profileIds.filter((profileId) => !props.lockedIds.includes(profileId))
    const nextProfileIds = props.multiple ? [...props.lockedIds, ...unlockedProfileIds] : profileIds.slice(-1)

    selectedProfileIds.value = props.maxSelected ? nextProfileIds.slice(0, props.maxSelected) : nextProfileIds
  }

  return {
    profileItems,
    selectProfiles
  }
}
