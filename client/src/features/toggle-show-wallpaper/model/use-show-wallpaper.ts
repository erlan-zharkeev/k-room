import { useSettings } from 'src/shared/preferences'

export const useShowWallpaper = () => {
  const settings = useSettings()

  const toggleShowWallpaper = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    settings.shallowUpdate({ showWallpaper: value })
  }

  return { toggleShowWallpaper }
}
