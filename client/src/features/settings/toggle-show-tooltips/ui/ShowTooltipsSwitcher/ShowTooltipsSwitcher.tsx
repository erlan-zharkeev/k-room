
import { useShowTooltip } from 'src/features/settings/toggle-show-tooltips/hooks'
import { SHOW_TOOLTIPS_SWITCHER_TEXT } from 'src/features/settings/toggle-show-tooltips/ui/ShowTooltipsSwitcher/config'

import { useSettings } from 'src/entities/settings'
import { useI18n } from 'src/entities/system'

import { AppSwitch, AppText } from 'src/shared/ui'

export const ShowTooltipsSwitcher = () => {
  const { showTooltips } = useSettings()
  const { toggleShowTooltip } = useShowTooltip()
  const { t } = useI18n()

  return (
    <div className="show-tooltips-switcher">
      <AppText size="small">{t(SHOW_TOOLTIPS_SWITCHER_TEXT.label)}</AppText>
      <AppSwitch
        value={showTooltips}
        name="tooltips"
        onText={t(SHOW_TOOLTIPS_SWITCHER_TEXT.show)}
        offText={t(SHOW_TOOLTIPS_SWITCHER_TEXT.hide)}
        onChange={toggleShowTooltip}
      />
    </div>
  )
}
