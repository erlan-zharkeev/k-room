import { useSettings } from 'src/shared/settings'

export const useShowWallpaper = () => {
  const settings = useSettings()

  const toggleShowWallpaper = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    settings.shallowUpdate({ showWallpaper: value })
  }

  return { toggleShowWallpaper }
}
