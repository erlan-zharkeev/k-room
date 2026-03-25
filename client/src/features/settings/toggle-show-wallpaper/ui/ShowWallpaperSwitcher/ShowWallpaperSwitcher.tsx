
import { useSettings } from 'src/entities/settings'
import { useI18n } from 'src/entities/system'

import { AppSwitch, AppText } from 'src/shared/ui'

import { useShowWallpaper } from '../../hooks'

import { SHOW_WALLPAPER_SWITCHER_TEXT } from './config'

export const ShowWallpaperSwitcher = () => {
  const { showWallpaper } = useSettings()
  const { toggleShowWallpaper } = useShowWallpaper()
  const { t } = useI18n()

  return (
    <div className="show-wallpaper-switcher">
      <AppText size="small">{t(SHOW_WALLPAPER_SWITCHER_TEXT.label)}</AppText>
      <AppSwitch
        value={showWallpaper}
        name="wallpaper"
        onText={t(SHOW_WALLPAPER_SWITCHER_TEXT.show)}
        offText={t(SHOW_WALLPAPER_SWITCHER_TEXT.hide)}
        onChange={toggleShowWallpaper}
      />
    </div>
  )
}
