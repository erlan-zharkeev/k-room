import { useDispatch } from 'react-redux'

import { setSoundValue } from 'src/entities/settings'

import { saveUserSetting } from '../../save-setting'

export const useEnableSound = () => {
  const dispatch = useDispatch()

  const toggleEnableSound = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    dispatch(setSoundValue(value))
    saveUserSetting({ type: 'soundOn', value })
  }

  return {
    toggleEnableSound
  }
}
