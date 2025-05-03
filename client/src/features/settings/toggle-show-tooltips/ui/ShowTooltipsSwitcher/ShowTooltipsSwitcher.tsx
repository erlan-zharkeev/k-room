import { useSettings } from 'src/entities/settings'

import { AppSwitch } from 'src/shared/ui'

import { useShowTooltip } from '../../hooks'

export const ShowTooltipsSwitcher = () => {
  const { showTooltips } = useSettings()
  const { toggleShowTooltip } = useShowTooltip()

  return (
    <div className="show-tooltips-switcher">
      <div className="paragraph-text paragraph-text--center">Tooltips</div>
      <AppSwitch value={showTooltips} name="tooltips" onText="Show" offText="Hide" onChange={toggleShowTooltip} />
    </div>
  )
}
