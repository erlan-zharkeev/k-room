import { useSettings } from 'src/entities/settings'

import { ContentTabType } from 'src/shared/config'

export const useContentTabSelect = () => {
  const { selectedContentTab, shallowUpdate } = useSettings()

  const selectContentTab = (value: ContentTabType) => {
    if (value === undefined || selectedContentTab === value) return
    shallowUpdate({ selectedContentTab: value })
  }

  return { selectContentTab }
}
