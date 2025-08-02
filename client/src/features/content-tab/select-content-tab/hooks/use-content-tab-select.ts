import { type ContentTabType, useSettings } from 'src/entities/settings'

export const useContentTabSelect = () => {
  const { selectedContentTab, updateSetting } = useSettings()

  const selectContentTab = (value: ContentTabType) => {
    if (value === undefined || selectedContentTab === value) return
    updateSetting({ selectedContentTab: value })
  }

  return { selectContentTab }
}
