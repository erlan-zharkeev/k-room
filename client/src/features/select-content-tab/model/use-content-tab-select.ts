import { ContentTabType } from 'src/shared/config'
import { useSettings } from 'src/shared/preferences'

export const useContentTabSelect = () => {
  const { selectedContentTab, shallowUpdate } = useSettings()

  const selectContentTab = (value: ContentTabType) => {
    if (value === undefined || selectedContentTab === value) return
    shallowUpdate({ selectedContentTab: value })
  }

  return { selectContentTab }
}
