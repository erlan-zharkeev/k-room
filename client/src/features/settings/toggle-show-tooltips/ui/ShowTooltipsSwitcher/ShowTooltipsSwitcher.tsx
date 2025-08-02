import { useSettings } from 'src/entities/settings'

import { AppSwitch, AppText } from 'src/shared/ui'

import { useShowTooltip } from '../../hooks'

export const ShowTooltipsSwitcher = () => {
  const { showTooltips } = useSettings()
  const { toggleShowTooltip } = useShowTooltip()

  return (
    <div className="show-tooltips-switcher">
      <AppText size="small">Tooltips</AppText>
      <AppSwitch value={showTooltips} name="tooltips" onText="Show" offText="Hide" onChange={toggleShowTooltip} />
    </div>
  )
}
