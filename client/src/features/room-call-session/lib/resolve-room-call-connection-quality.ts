import { isBoolean, isNumber, isString, isUnknownObject } from 'global-shared'

import { ROOM_CALL_CONNECTION_QUALITY_THRESHOLDS } from '../config/constants'
import type { RoomCallConnectionQuality } from '../config/types'

interface RoomCallConnectionQualityStats {
  jitter?: number
  packetLossRatio?: number
  roundTripTime?: number
}

const reconnectingPeerConnectionStates = ['connecting', 'disconnected', 'failed'] as const
const roomCallConnectionQualityWeight = {
  good: 0,
  unstable: 1,
  poor: 2,
  reconnecting: 3
} as const satisfies Record<RoomCallConnectionQuality, number>

const resolveFiniteNumberStat = (stats: Record<string, unknown>, key: string) => {
  const value = stats[key]

  return isNumber(value) && Number.isFinite(value) ? value : undefined
}

const resolveBooleanStat = (stats: Record<string, unknown>, key: string) => {
  const value = stats[key]

  return isBoolean(value) ? value : false
}

const resolvePacketLossRatio = (stats: Record<string, unknown>) => {
  const packetsLost = resolveFiniteNumberStat(stats, 'packetsLost')
  const packetsReceived = resolveFiniteNumberStat(stats, 'packetsReceived')

  if (packetsLost === undefined || packetsReceived === undefined) {
    return
  }

  const totalPackets = packetsLost + packetsReceived

  return totalPackets > 0 ? Math.max(packetsLost, 0) / totalPackets : undefined
}

const resolveRoundTripTime = (stats: Record<string, unknown>) => {
  const currentRoundTripTime = resolveFiniteNumberStat(stats, 'currentRoundTripTime')

  if (currentRoundTripTime !== undefined) {
    return currentRoundTripTime
  }

  const responsesReceived = resolveFiniteNumberStat(stats, 'responsesReceived')
  const totalRoundTripTime = resolveFiniteNumberStat(stats, 'totalRoundTripTime')

  return responsesReceived && totalRoundTripTime !== undefined ? totalRoundTripTime / responsesReceived : undefined
}

const updateMaxStatValue = (currentValue: number | undefined, nextValue: number | undefined) => {
  if (nextValue === undefined) {
    return currentValue
  }

  return currentValue === undefined ? nextValue : Math.max(currentValue, nextValue)
}

const collectRoomCallConnectionQualityStats = (statsReport: RTCStatsReport) => {
  const qualityStats: RoomCallConnectionQualityStats = {}

  statsReport.forEach((stats) => {
    if (!isUnknownObject(stats) || !isString(stats.type)) {
      return
    }

    if (stats.type === 'inbound-rtp') {
      qualityStats.jitter = updateMaxStatValue(qualityStats.jitter, resolveFiniteNumberStat(stats, 'jitter'))
      qualityStats.packetLossRatio = updateMaxStatValue(qualityStats.packetLossRatio, resolvePacketLossRatio(stats))
      return
    }

    const isCandidatePairStats = stats.type === 'candidate-pair'
    const isSelectedCandidatePair =
      resolveBooleanStat(stats, 'selected') || resolveBooleanStat(stats, 'nominated') || stats.state === 'succeeded'

    if (isCandidatePairStats && isSelectedCandidatePair) {
      qualityStats.roundTripTime = updateMaxStatValue(qualityStats.roundTripTime, resolveRoundTripTime(stats))
    }
  })

  return qualityStats
}

const hasReachedRoomCallConnectionQualityThreshold = (
  qualityStats: RoomCallConnectionQualityStats,
  threshold: (typeof ROOM_CALL_CONNECTION_QUALITY_THRESHOLDS)[keyof typeof ROOM_CALL_CONNECTION_QUALITY_THRESHOLDS]
) => {
  const hasRoundTripTimeIssue =
    qualityStats.roundTripTime !== undefined && qualityStats.roundTripTime >= threshold.roundTripTime
  const hasJitterIssue = qualityStats.jitter !== undefined && qualityStats.jitter >= threshold.jitter
  const hasPacketLossIssue =
    qualityStats.packetLossRatio !== undefined && qualityStats.packetLossRatio >= threshold.packetLossRatio

  return hasRoundTripTimeIssue || hasJitterIssue || hasPacketLossIssue
}

export const resolveRoomCallConnectionQuality = (
  connectionState: RTCPeerConnectionState,
  statsReport: RTCStatsReport
): RoomCallConnectionQuality => {
  if (reconnectingPeerConnectionStates.includes(connectionState as (typeof reconnectingPeerConnectionStates)[number])) {
    return 'reconnecting'
  }

  const qualityStats = collectRoomCallConnectionQualityStats(statsReport)

  if (hasReachedRoomCallConnectionQualityThreshold(qualityStats, ROOM_CALL_CONNECTION_QUALITY_THRESHOLDS.poor)) {
    return 'poor'
  }

  if (hasReachedRoomCallConnectionQualityThreshold(qualityStats, ROOM_CALL_CONNECTION_QUALITY_THRESHOLDS.unstable)) {
    return 'unstable'
  }

  return 'good'
}

export const resolveWorstRoomCallConnectionQuality = (
  qualities: Array<RoomCallConnectionQuality | undefined>
): RoomCallConnectionQuality | undefined => {
  let worstQuality: RoomCallConnectionQuality | undefined

  qualities.forEach((quality) => {
    if (!quality) {
      return
    }

    if (!worstQuality || roomCallConnectionQualityWeight[quality] > roomCallConnectionQualityWeight[worstQuality]) {
      worstQuality = quality
    }
  })

  return worstQuality
}
