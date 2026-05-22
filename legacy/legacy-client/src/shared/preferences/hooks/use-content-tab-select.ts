import { ContentTab } from 'src/shared/config'

import { useSettings } from './use-settings'

export const useContentTabSelect = () => {
  const { selectedContentTab, shallowUpdate } = useSettings()

  const selectContentTab = (value: ContentTab) => {
    if (value === undefined || selectedContentTab === value) return
    shallowUpdate({ selectedContentTab: value })
  }

  return { selectContentTab }
}
