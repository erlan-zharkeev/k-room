import { useSettings } from 'src/entities/settings'

import { ContentTabType } from 'src/shared/config'

export const useContentTabSelect = () => {
  const { selectedContentTab, update } = useSettings()

  const selectContentTab = (value: ContentTabType) => {
    if (value === undefined || selectedContentTab === value) return
    update({ selectedContentTab: value })
  }

  return { selectContentTab }
}
