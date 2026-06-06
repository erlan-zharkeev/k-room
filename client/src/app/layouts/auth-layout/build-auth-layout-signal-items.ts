import {
  AUTH_LAYOUT_LENS_GHOST_DELAY_SECONDS_RANGE,
  AUTH_LAYOUT_LENS_GHOST_DRIFT_X_PX_RANGE,
  AUTH_LAYOUT_LENS_GHOST_DRIFT_Y_PX_RANGE,
  AUTH_LAYOUT_LENS_GHOST_DURATION_SECONDS_RANGE,
  AUTH_LAYOUT_LENS_GHOST_LEFT_PERCENT_RANGE,
  AUTH_LAYOUT_LENS_GHOST_ROTATE_DEGREE_RANGE,
  AUTH_LAYOUT_LENS_GHOST_SIZE_PX_RANGE,
  AUTH_LAYOUT_LENS_GHOST_TOP_PERCENT_RANGE,
  AUTH_LAYOUT_SIGNAL_LEFT_PERCENT_RANGE,
  AUTH_LAYOUT_SIGNAL_LINK_DELAY_SECONDS_RANGE,
  AUTH_LAYOUT_SIGNAL_LINK_DURATION_SECONDS_RANGE,
  AUTH_LAYOUT_SIGNAL_LINK_ROTATE_DEGREE_RANGE,
  AUTH_LAYOUT_SIGNAL_LINK_WIDTH_PERCENT_RANGE,
  AUTH_LAYOUT_SIGNAL_TOP_PERCENT_RANGE,
  AUTH_LAYOUT_VOICE_WAVE_APPEAR_DELAY_SECONDS_RANGE,
  AUTH_LAYOUT_VOICE_WAVE_APPEAR_DURATION_SECONDS_RANGE,
  AUTH_LAYOUT_VOICE_WAVE_BAR_DELAY_SECONDS_RANGE,
  AUTH_LAYOUT_VOICE_WAVE_BAR_DURATION_SECONDS_RANGE,
  AUTH_LAYOUT_VOICE_WAVE_LEFT_PERCENT_RANGE,
  AUTH_LAYOUT_VOICE_WAVE_TOP_PERCENT_RANGE,
  AUTH_LAYOUT_VOICE_WAVE_WIDTH_PX_RANGE,
  AUTH_LAYOUT_SIGNAL_WAVE_DELAY_SECONDS_RANGE,
  AUTH_LAYOUT_SIGNAL_WAVE_DURATION_SECONDS_RANGE,
  AUTH_LAYOUT_SIGNAL_WAVE_SIZE_PX_RANGE
} from './constants'
import type { AuthLayoutSignalItem } from './types'

const buildRandomNumber = ([min, max]: readonly [number, number]) => min + Math.random() * (max - min)

const buildSignalId = (kind: string, index: number) => `${kind}-${index}-${Math.random().toString(36).slice(2)}`

const buildPercent = (range: readonly [number, number]) => `${buildRandomNumber(range).toFixed(2)}%`

const buildPixel = (range: readonly [number, number]) => `${buildRandomNumber(range).toFixed(2)}px`

const buildSecond = (range: readonly [number, number]) => `${buildRandomNumber(range).toFixed(2)}s`

const buildDegree = (range: readonly [number, number]) => `${buildRandomNumber(range).toFixed(2)}deg`

export const buildAuthLayoutSignalWaves = (count: number): AuthLayoutSignalItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: buildSignalId('wave', index),
    style: {
      '--auth-layout-signal-left': buildPercent(AUTH_LAYOUT_SIGNAL_LEFT_PERCENT_RANGE),
      '--auth-layout-signal-top': buildPercent(AUTH_LAYOUT_SIGNAL_TOP_PERCENT_RANGE),
      '--auth-layout-signal-size': buildPixel(AUTH_LAYOUT_SIGNAL_WAVE_SIZE_PX_RANGE),
      '--auth-layout-signal-delay': buildSecond(AUTH_LAYOUT_SIGNAL_WAVE_DELAY_SECONDS_RANGE),
      '--auth-layout-signal-duration': buildSecond(AUTH_LAYOUT_SIGNAL_WAVE_DURATION_SECONDS_RANGE)
    }
  }))

export const buildAuthLayoutSignalLinks = (count: number): AuthLayoutSignalItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: buildSignalId('link', index),
    style: {
      '--auth-layout-signal-left': buildPercent(AUTH_LAYOUT_SIGNAL_LEFT_PERCENT_RANGE),
      '--auth-layout-signal-top': buildPercent(AUTH_LAYOUT_SIGNAL_TOP_PERCENT_RANGE),
      '--auth-layout-signal-width': buildPercent(AUTH_LAYOUT_SIGNAL_LINK_WIDTH_PERCENT_RANGE),
      '--auth-layout-signal-rotate': buildDegree(AUTH_LAYOUT_SIGNAL_LINK_ROTATE_DEGREE_RANGE),
      '--auth-layout-signal-delay': buildSecond(AUTH_LAYOUT_SIGNAL_LINK_DELAY_SECONDS_RANGE),
      '--auth-layout-signal-duration': buildSecond(AUTH_LAYOUT_SIGNAL_LINK_DURATION_SECONDS_RANGE)
    }
  }))

export const buildAuthLayoutVoiceWaves = (count: number): AuthLayoutSignalItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: buildSignalId('voice', index),
    style: {
      '--auth-layout-signal-left': buildPercent(AUTH_LAYOUT_VOICE_WAVE_LEFT_PERCENT_RANGE),
      '--auth-layout-signal-top': buildPercent(AUTH_LAYOUT_VOICE_WAVE_TOP_PERCENT_RANGE),
      '--auth-layout-signal-width': buildPixel(AUTH_LAYOUT_VOICE_WAVE_WIDTH_PX_RANGE),
      '--auth-layout-voice-wave-appear-delay': buildSecond(AUTH_LAYOUT_VOICE_WAVE_APPEAR_DELAY_SECONDS_RANGE),
      '--auth-layout-voice-wave-appear-duration': buildSecond(AUTH_LAYOUT_VOICE_WAVE_APPEAR_DURATION_SECONDS_RANGE),
      '--auth-layout-voice-wave-bar-delay': buildSecond(AUTH_LAYOUT_VOICE_WAVE_BAR_DELAY_SECONDS_RANGE),
      '--auth-layout-voice-wave-bar-duration': buildSecond(AUTH_LAYOUT_VOICE_WAVE_BAR_DURATION_SECONDS_RANGE)
    }
  }))

export const buildAuthLayoutLensGhosts = (count: number): AuthLayoutSignalItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: buildSignalId('lens', index),
    style: {
      '--auth-layout-lens-ghost-left': buildPercent(AUTH_LAYOUT_LENS_GHOST_LEFT_PERCENT_RANGE),
      '--auth-layout-lens-ghost-top': buildPercent(AUTH_LAYOUT_LENS_GHOST_TOP_PERCENT_RANGE),
      '--auth-layout-lens-ghost-size': buildPixel(AUTH_LAYOUT_LENS_GHOST_SIZE_PX_RANGE),
      '--auth-layout-lens-ghost-delay': buildSecond(AUTH_LAYOUT_LENS_GHOST_DELAY_SECONDS_RANGE),
      '--auth-layout-lens-ghost-duration': buildSecond(AUTH_LAYOUT_LENS_GHOST_DURATION_SECONDS_RANGE),
      '--auth-layout-lens-ghost-start-x': buildPixel(AUTH_LAYOUT_LENS_GHOST_DRIFT_X_PX_RANGE),
      '--auth-layout-lens-ghost-start-y': buildPixel(AUTH_LAYOUT_LENS_GHOST_DRIFT_Y_PX_RANGE),
      '--auth-layout-lens-ghost-end-x': buildPixel(AUTH_LAYOUT_LENS_GHOST_DRIFT_X_PX_RANGE),
      '--auth-layout-lens-ghost-end-y': buildPixel(AUTH_LAYOUT_LENS_GHOST_DRIFT_Y_PX_RANGE),
      '--auth-layout-lens-ghost-start-rotate': buildDegree(AUTH_LAYOUT_LENS_GHOST_ROTATE_DEGREE_RANGE),
      '--auth-layout-lens-ghost-end-rotate': buildDegree(AUTH_LAYOUT_LENS_GHOST_ROTATE_DEGREE_RANGE)
    }
  }))
