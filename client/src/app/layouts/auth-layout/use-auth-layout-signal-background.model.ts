import {
  buildAuthLayoutLensGhosts,
  buildAuthLayoutSignalLinks,
  buildAuthLayoutSignalWaves,
  buildAuthLayoutVoiceWaves
} from './build-auth-layout-signal-items'
import {
  AUTH_LAYOUT_LENS_GHOST_COUNT,
  AUTH_LAYOUT_SIGNAL_LINK_COUNT,
  AUTH_LAYOUT_SIGNAL_WAVE_COUNT,
  AUTH_LAYOUT_VOICE_WAVE_COUNT
} from './constants'

export const useAuthLayoutSignalBackground = () => {
  const lensGhosts = buildAuthLayoutLensGhosts(AUTH_LAYOUT_LENS_GHOST_COUNT)
  const signalLinks = buildAuthLayoutSignalLinks(AUTH_LAYOUT_SIGNAL_LINK_COUNT)
  const signalWaves = buildAuthLayoutSignalWaves(AUTH_LAYOUT_SIGNAL_WAVE_COUNT)
  const voiceWaves = buildAuthLayoutVoiceWaves(AUTH_LAYOUT_VOICE_WAVE_COUNT)

  return {
    lensGhosts,
    signalLinks,
    signalWaves,
    voiceWaves
  }
}
