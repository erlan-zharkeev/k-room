import { useShowTooltip, SHOW_TOOLTIPS_SWITCHER_I18N } from 'src/features/settings'

import { useSettings, useI18n } from 'src/entities/settings'

import { AppSwitch, AppText } from 'src/shared/ui'

export const ShowTooltipsSwitcher = () => {
  const { showTooltips } = useSettings()
  const { toggleShowTooltip } = useShowTooltip()
  const { t } = useI18n()

  return (
    <div className="show-tooltips-switcher">
      <AppText size="small">{t(SHOW_TOOLTIPS_SWITCHER_I18N.label)}</AppText>
      <AppSwitch
        value={showTooltips}
        name="tooltips"
        onText={t(SHOW_TOOLTIPS_SWITCHER_I18N.show)}
        offText={t(SHOW_TOOLTIPS_SWITCHER_I18N.hide)}
        onChange={toggleShowTooltip}
      />
    </div>
  )
}
