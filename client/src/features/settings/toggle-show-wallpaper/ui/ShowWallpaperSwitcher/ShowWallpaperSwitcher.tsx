import { useShowWallpaper, SHOW_WALLPAPER_SWITCHER_I18N } from 'src/features/settings'

import { useSettings, useI18n } from 'src/entities/settings'

import { AppSwitch, AppText } from 'src/shared/ui'

export const ShowWallpaperSwitcher = () => {
  const { showWallpaper } = useSettings()
  const { toggleShowWallpaper } = useShowWallpaper()
  const { t } = useI18n()

  return (
    <div className="show-wallpaper-switcher">
      <AppText size="small">{t(SHOW_WALLPAPER_SWITCHER_I18N.label)}</AppText>
      <AppSwitch
        value={showWallpaper}
        name="wallpaper"
        onText={t(SHOW_WALLPAPER_SWITCHER_I18N.show)}
        offText={t(SHOW_WALLPAPER_SWITCHER_I18N.hide)}
        onChange={toggleShowWallpaper}
      />
    </div>
  )
}
