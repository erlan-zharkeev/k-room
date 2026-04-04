import { useSettings } from 'src/entities/settings'

export const useShowWallpaper = () => {
  const settings = useSettings()

  const toggleShowWallpaper = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    settings.shallowUpdate({ showWallpaper: value })
  }

  return { toggleShowWallpaper }
}
