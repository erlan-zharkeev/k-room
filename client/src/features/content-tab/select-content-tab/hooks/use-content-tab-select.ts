import { ContentTabType } from 'common-types'
import { useDispatch } from 'react-redux'

import { saveUserSetting } from 'src/features/settings'

import { changeSelectedContentElement } from 'src/entities/settings'

export const useContentTabSelect = () => {
  const dispatch = useDispatch()

  const selectContentTab = (value: ContentTabType) => {
    if (value === undefined) return
    dispatch(changeSelectedContentElement(value))
    saveUserSetting({ type: 'selectedContentTab', value })
  }

  return { selectContentTab }
}
