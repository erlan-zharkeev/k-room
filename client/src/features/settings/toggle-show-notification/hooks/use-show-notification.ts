import { useDispatch } from 'react-redux'

import { setAbleToShowNotification } from 'src/entities/settings'

import { saveUserSetting } from '../../save-setting'

export const useShowNotification = () => {
  const dispatch = useDispatch()

  const toggleShowNotification = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    dispatch(setAbleToShowNotification(value))
    saveUserSetting({ type: 'showNotification', value })
  }

  return { toggleShowNotification }
}
