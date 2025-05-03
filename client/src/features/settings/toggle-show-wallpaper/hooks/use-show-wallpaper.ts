import { useDispatch } from 'react-redux'

import { showWallpaper } from 'src/entities/settings'

import { saveUserSetting } from '../../save-setting'

export const useShowWallpaper = () => {
  const dispatch = useDispatch()

  const toggleShowWallpaper = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    dispatch(showWallpaper(value))
    saveUserSetting({ type: 'showWallpaper', value })
  }

  return { toggleShowWallpaper }
}
