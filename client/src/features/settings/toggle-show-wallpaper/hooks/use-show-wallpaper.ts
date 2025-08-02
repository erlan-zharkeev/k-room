import { useSettings } from 'src/entities/settings'

export const useShowWallpaper = () => {
  const { updateSetting } = useSettings()

  const toggleShowWallpaper = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    updateSetting({ showWallpaper: value })
  }

  return { toggleShowWallpaper }
}
