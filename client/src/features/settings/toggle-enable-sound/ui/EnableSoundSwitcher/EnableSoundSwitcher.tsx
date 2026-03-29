import './style.scss'

import { useEnableSound, ENABLE_SOUND_SWITCHER_I18N } from 'src/features/settings/toggle-enable-sound'

import { useSettings } from 'src/entities/settings'
import { useI18n, useSystem } from 'src/entities/system'

import { AppSwitch, AppText, AppTooltip } from 'src/shared/ui'

export const EnableSoundSwitcher = () => {
  const { toggleEnableSound } = useEnableSound()
  const { soundOn } = useSettings()
  const { hasInteracted } = useSystem()
  const { t } = useI18n()
  const tooltipText = !hasInteracted ? t(ENABLE_SOUND_SWITCHER_I18N.tooltip) : ''

  return (
    <div className="enable-sound-switcher">
      <AppText size="small">{t(ENABLE_SOUND_SWITCHER_I18N.label)}</AppText>
      <AppTooltip text={tooltipText} placement="right">
        <AppSwitch
          value={soundOn}
          name="sound"
          onText={t(ENABLE_SOUND_SWITCHER_I18N.on)}
          offText={t(ENABLE_SOUND_SWITCHER_I18N.off)}
          onChange={toggleEnableSound}
          disabled={!hasInteracted}
        />
      </AppTooltip>
    </div>
  )
}
