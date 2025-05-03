import { useDispatch } from 'react-redux'

import { setTooltipsValue } from 'src/entities/settings'

import { saveUserSetting } from '../../save-setting'

export const useShowTooltip = () => {
  const dispatch = useDispatch()

  const toggleShowTooltip = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    dispatch(setTooltipsValue(value))
    saveUserSetting({ type: 'showTooltips', value })
  }

  return { toggleShowTooltip }
}
