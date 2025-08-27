import { useSettings } from 'src/entities/settings'

export const useShowWallpaper = () => {
  const settings = useSettings()

  const toggleShowWallpaper = (payload: React.ChangeEvent<HTMLInputElement>) => {
    const value = payload.target.checked
    settings.update({ showWallpaper: value })
  }

  return { toggleShowWallpaper }
}
