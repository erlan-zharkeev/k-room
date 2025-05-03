import { useSettings } from 'src/entities/settings'

import { AppSwitch } from 'src/shared/ui'

import { useShowWallpaper } from '../../hooks'

export const ShowWallpaperSwitcher = () => {
  const { showWallpaper } = useSettings()
  const { toggleShowWallpaper } = useShowWallpaper()

  return (
    <div className="show-wallpaper-switcher">
      <div className="paragraph-text paragraph-text--center">Wallpaper</div>
      <AppSwitch value={showWallpaper} name="wallpaper" onText="Show" offText="Hide" onChange={toggleShowWallpaper} />
    </div>
  )
}
