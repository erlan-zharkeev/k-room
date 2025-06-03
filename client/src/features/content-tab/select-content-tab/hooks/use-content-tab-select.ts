import { ContentTabType } from 'common-types'
import { useDispatch } from 'react-redux'

import { saveUserSetting } from 'src/features/settings'

import { changeSelectedContentElement, useSettings } from 'src/entities/settings'

export const useContentTabSelect = () => {
  const dispatch = useDispatch()
  const { selectedContentTab } = useSettings()

  const selectContentTab = (value: ContentTabType) => {
    if (value === undefined || selectedContentTab === value) return
    dispatch(changeSelectedContentElement(value))
    saveUserSetting({ type: 'selectedContentTab', value })
  }

  return { selectContentTab }
}
