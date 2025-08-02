import { useSettings } from 'src/entities/settings'

import { AppSwitch, AppText } from 'src/shared/ui'

import { useShowWallpaper } from '../../hooks'

export const ShowWallpaperSwitcher = () => {
  const { showWallpaper } = useSettings()
  const { toggleShowWallpaper } = useShowWallpaper()

  return (
    <div className="show-wallpaper-switcher">
      <AppText size="small">Wallpaper</AppText>
      <AppSwitch value={showWallpaper} name="wallpaper" onText="Show" offText="Hide" onChange={toggleShowWallpaper} />
    </div>
  )
}
