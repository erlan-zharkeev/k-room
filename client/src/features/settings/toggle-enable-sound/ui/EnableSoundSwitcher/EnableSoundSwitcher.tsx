import './style.scss'

import { useSettings } from 'src/entities/settings'
import { useSystem } from 'src/entities/system'

import { AppSwitch, AppTooltip } from 'src/shared/ui'

import { useEnableSound } from '../../hooks'

export const EnableSoundSwitcher = () => {
  const { toggleEnableSound } = useEnableSound()
  const { soundOn } = useSettings()
  const { hasInteracted } = useSystem()
  const tooltipText = !hasInteracted
    ? 'The browser requires some kind of user action to activate the sound. Click anywhere to activate the audio context.'
    : ''

  return (
    <div className="enable-sound-switcher">
      <div className="paragraph-text paragraph-text--center">Sound</div>
      <AppTooltip text={tooltipText} placement="right">
        <AppSwitch value={soundOn} name="sound" onChange={toggleEnableSound} disabled={!hasInteracted} />
      </AppTooltip>
    </div>
  )
}
