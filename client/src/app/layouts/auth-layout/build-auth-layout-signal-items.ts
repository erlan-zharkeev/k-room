import {
  AUTH_LAYOUT_LENS_GHOST_DELAY_SECONDS_RANGE,
  AUTH_LAYOUT_LENS_GHOST_DRIFT_X_PX_RANGE,
  AUTH_LAYOUT_LENS_GHOST_DRIFT_Y_PX_RANGE,
  AUTH_LAYOUT_LENS_GHOST_DURATION_SECONDS_RANGE,
  AUTH_LAYOUT_LENS_GHOST_ROTATE_DEGREE_RANGE,
  AUTH_LAYOUT_LENS_GHOST_SIZE_PX_RANGE,
  AUTH_LAYOUT_SIGNAL_LINK_DELAY_SECONDS_RANGE,
  AUTH_LAYOUT_SIGNAL_LINK_DURATION_SECONDS_RANGE,
  AUTH_LAYOUT_SIGNAL_LINK_ROTATE_DEGREE_RANGE,
  AUTH_LAYOUT_SIGNAL_LINK_WIDTH_PERCENT_RANGE,
  AUTH_LAYOUT_SIGNAL_POSITION_JITTER_RATIO_RANGE,
  AUTH_LAYOUT_SIGNAL_POSITION_PERCENT_RANGE,
  AUTH_LAYOUT_VOICE_WAVE_APPEAR_DELAY_SECONDS_RANGE,
  AUTH_LAYOUT_VOICE_WAVE_APPEAR_DURATION_SECONDS_RANGE,
  AUTH_LAYOUT_VOICE_WAVE_BAR_DELAY_SECONDS_RANGE,
  AUTH_LAYOUT_VOICE_WAVE_BAR_DURATION_SECONDS_RANGE,
  AUTH_LAYOUT_VOICE_WAVE_WIDTH_PX_RANGE,
  AUTH_LAYOUT_SIGNAL_WAVE_DELAY_SECONDS_RANGE,
  AUTH_LAYOUT_SIGNAL_WAVE_DURATION_SECONDS_RANGE,
  AUTH_LAYOUT_SIGNAL_WAVE_SIZE_PX_RANGE
} from './constants'
import type { AuthLayoutSignalItem, AuthLayoutSignalPosition } from './types'

const buildRandomNumber = ([min, max]: readonly [number, number]) => min + Math.random() * (max - min)

const buildSignalId = (kind: string, index: number) => `${kind}-${index}-${Math.random().toString(36).slice(2)}`

const buildPixel = (range: readonly [number, number]) => `${buildRandomNumber(range).toFixed(2)}px`

const buildSecond = (range: readonly [number, number]) => `${buildRandomNumber(range).toFixed(2)}s`

const buildDegree = (range: readonly [number, number]) => `${buildRandomNumber(range).toFixed(2)}deg`

const buildPercent = (value: number) => `${value.toFixed(2)}%`

const buildRandomPercent = (range: readonly [number, number]) => buildPercent(buildRandomNumber(range))

const buildClampedNumber = (value: number, [min, max]: readonly [number, number]) => Math.min(Math.max(value, min), max)

const buildShuffledIndexes = (count: number) => {
  const indexes = Array.from({ length: count }, (_, index) => index)

  indexes.forEach((_, index) => {
    const swapIndex = index + Math.floor(Math.random() * (indexes.length - index))
    const currentIndex = indexes[index]
    indexes[index] = indexes[swapIndex]
    indexes[swapIndex] = currentIndex
  })

  return indexes
}

const buildAuthLayoutSignalPosition = (
  cellIndex: number,
  columnCount: number,
  rowCount: number
): AuthLayoutSignalPosition => {
  const [minPercent, maxPercent] = AUTH_LAYOUT_SIGNAL_POSITION_PERCENT_RANGE
  const percentSize = maxPercent - minPercent
  const columnWidth = percentSize / columnCount
  const rowHeight = percentSize / rowCount
  const columnIndex = cellIndex % columnCount
  const rowIndex = Math.floor(cellIndex / columnCount)
  const leftJitter = buildRandomNumber(AUTH_LAYOUT_SIGNAL_POSITION_JITTER_RATIO_RANGE) * columnWidth
  const topJitter = buildRandomNumber(AUTH_LAYOUT_SIGNAL_POSITION_JITTER_RATIO_RANGE) * rowHeight

  const left = minPercent + columnWidth * (columnIndex + 0.5) + leftJitter
  const top = minPercent + rowHeight * (rowIndex + 0.5) + topJitter

  return {
    left: buildPercent(buildClampedNumber(left, AUTH_LAYOUT_SIGNAL_POSITION_PERCENT_RANGE)),
    top: buildPercent(buildClampedNumber(top, AUTH_LAYOUT_SIGNAL_POSITION_PERCENT_RANGE))
  }
}

export const buildAuthLayoutSignalPositions = (count: number): AuthLayoutSignalPosition[] => {
  const columnCount = Math.ceil(Math.sqrt(count))
  const rowCount = Math.ceil(count / columnCount)
  const cellIndexes = buildShuffledIndexes(columnCount * rowCount).slice(0, count)

  return cellIndexes.map((cellIndex) => buildAuthLayoutSignalPosition(cellIndex, columnCount, rowCount))
}

export const buildAuthLayoutSignalWaves = (positions: AuthLayoutSignalPosition[]): AuthLayoutSignalItem[] =>
  positions.map((position, index) => ({
    id: buildSignalId('wave', index),
    style: {
      '--auth-layout-signal-left': position.left,
      '--auth-layout-signal-top': position.top,
      '--auth-layout-signal-size': buildPixel(AUTH_LAYOUT_SIGNAL_WAVE_SIZE_PX_RANGE),
      '--auth-layout-signal-delay': buildSecond(AUTH_LAYOUT_SIGNAL_WAVE_DELAY_SECONDS_RANGE),
      '--auth-layout-signal-duration': buildSecond(AUTH_LAYOUT_SIGNAL_WAVE_DURATION_SECONDS_RANGE)
    }
  }))

export const buildAuthLayoutSignalLinks = (positions: AuthLayoutSignalPosition[]): AuthLayoutSignalItem[] =>
  positions.map((position, index) => ({
    id: buildSignalId('link', index),
    style: {
      '--auth-layout-signal-left': position.left,
      '--auth-layout-signal-top': position.top,
      '--auth-layout-signal-width': buildRandomPercent(AUTH_LAYOUT_SIGNAL_LINK_WIDTH_PERCENT_RANGE),
      '--auth-layout-signal-rotate': buildDegree(AUTH_LAYOUT_SIGNAL_LINK_ROTATE_DEGREE_RANGE),
      '--auth-layout-signal-delay': buildSecond(AUTH_LAYOUT_SIGNAL_LINK_DELAY_SECONDS_RANGE),
      '--auth-layout-signal-duration': buildSecond(AUTH_LAYOUT_SIGNAL_LINK_DURATION_SECONDS_RANGE)
    }
  }))

export const buildAuthLayoutVoiceWaves = (positions: AuthLayoutSignalPosition[]): AuthLayoutSignalItem[] =>
  positions.map((position, index) => ({
    id: buildSignalId('voice', index),
    style: {
      '--auth-layout-signal-left': position.left,
      '--auth-layout-signal-top': position.top,
      '--auth-layout-signal-width': buildPixel(AUTH_LAYOUT_VOICE_WAVE_WIDTH_PX_RANGE),
      '--auth-layout-voice-wave-appear-delay': buildSecond(AUTH_LAYOUT_VOICE_WAVE_APPEAR_DELAY_SECONDS_RANGE),
      '--auth-layout-voice-wave-appear-duration': buildSecond(AUTH_LAYOUT_VOICE_WAVE_APPEAR_DURATION_SECONDS_RANGE),
      '--auth-layout-voice-wave-bar-delay': buildSecond(AUTH_LAYOUT_VOICE_WAVE_BAR_DELAY_SECONDS_RANGE),
      '--auth-layout-voice-wave-bar-duration': buildSecond(AUTH_LAYOUT_VOICE_WAVE_BAR_DURATION_SECONDS_RANGE)
    }
  }))

export const buildAuthLayoutLensGhosts = (positions: AuthLayoutSignalPosition[]): AuthLayoutSignalItem[] =>
  positions.map((position, index) => ({
    id: buildSignalId('lens', index),
    style: {
      '--auth-layout-lens-ghost-left': position.left,
      '--auth-layout-lens-ghost-top': position.top,
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
