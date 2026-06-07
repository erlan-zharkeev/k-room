import {
  buildAuthLayoutLensGhosts,
  buildAuthLayoutSignalLinks,
  buildAuthLayoutSignalPositions,
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
  const signalWavePositionEnd = AUTH_LAYOUT_SIGNAL_WAVE_COUNT
  const signalLinkPositionEnd = signalWavePositionEnd + AUTH_LAYOUT_SIGNAL_LINK_COUNT
  const voiceWavePositionEnd = signalLinkPositionEnd + AUTH_LAYOUT_VOICE_WAVE_COUNT
  const lensGhostPositionEnd = voiceWavePositionEnd + AUTH_LAYOUT_LENS_GHOST_COUNT
  const signalPositions = buildAuthLayoutSignalPositions(lensGhostPositionEnd)

  const signalWaves = buildAuthLayoutSignalWaves(signalPositions.slice(0, signalWavePositionEnd))
  const signalLinks = buildAuthLayoutSignalLinks(signalPositions.slice(signalWavePositionEnd, signalLinkPositionEnd))
  const voiceWaves = buildAuthLayoutVoiceWaves(signalPositions.slice(signalLinkPositionEnd, voiceWavePositionEnd))
  const lensGhosts = buildAuthLayoutLensGhosts(signalPositions.slice(voiceWavePositionEnd, lensGhostPositionEnd))

  return {
    lensGhosts,
    signalLinks,
    signalWaves,
    voiceWaves
  }
}
