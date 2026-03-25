
import { useSettings } from 'src/entities/settings'
import { useI18n } from 'src/entities/system'

import { AppSwitch, AppText } from 'src/shared/ui'

import { useShowTooltip } from '../../hooks'

import { SHOW_TOOLTIPS_SWITCHER_TEXT } from './config'

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
