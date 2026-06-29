import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { useRoomCallRuntimeState } from 'src/features/room-call-session'
import { calculateAudioVolumeDb, createAudioMeterAnalyser, log, useLiveMediaUrl } from 'src/shared/lib'

import {
  ROOM_CALL_CONNECTION_QUALITY_ACTIVE_BAR_COUNT_BY_KIND,
  ROOM_CALL_CONNECTION_QUALITY_BAR_LEVELS,
  ROOM_CALL_TEMPORARY_QUICK_COMMAND_I18N_BY_COMMAND,
  ROOM_CALL_TEMPORARY_QUICK_COMMAND_TEXT_COLOR_BY_COMMAND
} from '../config/constants'
import type { RoomCallTileAudioActivityMonitor, RoomCallTileProps } from '../config/types'

export const useRoomCallTile = (props: RoomCallTileProps) => {
  const roomCallTileAudioVolumeDb = ref(Number.NEGATIVE_INFINITY)
  const avatarImageSrc = useLiveMediaUrl(() => props.item.avatarId)
  const {
    hiddenRemoteVideoByUserId,
    mutedRemoteAudioByUserId,
    toggleRemoteAudioMuted: toggleRoomCallRemoteAudioMuted,
    toggleRemoteVideoHidden: toggleRoomCallRemoteVideoHidden
  } = useRoomCallRuntimeState()
  let audioActivityMonitor: RoomCallTileAudioActivityMonitor | null = null
  let monitoredStream: MediaStream | null = null
  const hasStream = computed(() => Boolean(props.item.stream))
  const isRoomCallScreenTile = computed(() => props.item.kind === 'screen')
  const isRemoteAudioMuted = computed(() => Boolean(mutedRemoteAudioByUserId.value[props.item.id]))
  const isRemoteVideoHidden = computed(() => Boolean(hiddenRemoteVideoByUserId.value[props.item.id]))
  const hasEnabledVideo = computed(() =>
    isRoomCallScreenTile.value ? props.item.mediaState.screen : props.item.mediaState.video
  )
  const hasVisibleVideo = computed(() => {
    const hasLocalVideoVisibility = props.self || !isRemoteVideoHidden.value

    return hasEnabledVideo.value && hasStream.value && hasLocalVideoVisibility
  })
  const isRoomCallParticipantTile = computed(() => props.item.kind === 'participant')
  const remoteHideButtonText = computed(() => (isRemoteVideoHidden.value ? 'show' : 'hide'))
  const remoteMuteButtonText = computed(() => (isRemoteAudioMuted.value ? 'unmute' : 'mute'))
  const isMediaTileVideoOff = computed(() => !hasVisibleVideo.value)
  const isRoomCallTileAudioMeterVisible = computed(() => isRoomCallParticipantTile.value)
  const isRoomCallTileParticipantMediaStateVisible = computed(
    () => isRoomCallParticipantTile.value && !props.item.isLocal
  )
  const isRoomCallTileQuickCommandsVisible = computed(
    () => isRoomCallParticipantTile.value && Boolean(props.item.isHandRaised || props.item.temporaryQuickCommand)
  )
  const isRoomCallTileRemoteActionsVisible = computed(() => !props.self && isRoomCallParticipantTile.value)
  const roomCallConnectionQualityClass = computed(() =>
    props.item.connectionQuality ? `room-call-tile__connection-quality--${props.item.connectionQuality}` : undefined
  )
  const roomCallConnectionQualityBarItems = computed(() => {
    const connectionQuality = props.item.connectionQuality

    if (!connectionQuality) {
      return []
    }

    const activeBarCount = ROOM_CALL_CONNECTION_QUALITY_ACTIVE_BAR_COUNT_BY_KIND[connectionQuality]

    return ROOM_CALL_CONNECTION_QUALITY_BAR_LEVELS.map((level) => ({
      active: level <= activeBarCount,
      level,
      reconnecting: connectionQuality === 'reconnecting'
    }))
  })
  const temporaryQuickCommandI18n = computed(() => {
    const quickCommand = props.item.temporaryQuickCommand?.command

    return quickCommand && ROOM_CALL_TEMPORARY_QUICK_COMMAND_I18N_BY_COMMAND[quickCommand]
  })
  const temporaryQuickCommandTextColor = computed(() => {
    const quickCommand = props.item.temporaryQuickCommand?.command

    return quickCommand && ROOM_CALL_TEMPORARY_QUICK_COMMAND_TEXT_COLOR_BY_COMMAND[quickCommand]
  })

  const stopRoomCallTileAudioActivityMonitor = () => {
    if (!audioActivityMonitor) {
      return
    }

    window.cancelAnimationFrame(audioActivityMonitor.frameId)
    audioActivityMonitor.source.disconnect()
    audioActivityMonitor.analyser.disconnect()
    audioActivityMonitor.context.close().catch((error) => log('warn', 'Failed to close room call audio context', error))
    audioActivityMonitor = null
    roomCallTileAudioVolumeDb.value = Number.NEGATIVE_INFINITY
  }

  const updateRoomCallTileAudioActivity = () => {
    if (!audioActivityMonitor) {
      return
    }

    audioActivityMonitor.analyser.getFloatTimeDomainData(audioActivityMonitor.data)
    roomCallTileAudioVolumeDb.value = calculateAudioVolumeDb(audioActivityMonitor.data)
    audioActivityMonitor.frameId = window.requestAnimationFrame(updateRoomCallTileAudioActivity)
  }

  const startRoomCallTileAudioActivityMonitor = (stream: MediaStream) => {
    stopRoomCallTileAudioActivityMonitor()

    const audioMeterAnalyser = createAudioMeterAnalyser(stream)

    audioActivityMonitor = {
      ...audioMeterAnalyser,
      frameId: 0
    }

    if (audioMeterAnalyser.context.state === 'suspended') {
      audioMeterAnalyser.context
        .resume()
        .catch((error) => log('warn', 'Failed to resume room call audio context', error))
    }

    updateRoomCallTileAudioActivity()
  }

  const syncRoomCallTileAudioActivityMonitor = () => {
    stopRoomCallTileAudioActivityMonitor()

    const stream = props.item.audioActivityStream
    const hasAudioTrack = Boolean(stream?.getAudioTracks().length)
    const hasNoAudioActivitySource = !stream || !hasAudioTrack

    if (hasNoAudioActivitySource) {
      return
    }

    startRoomCallTileAudioActivityMonitor(stream)
  }

  const detachRoomCallTileAudioActivityStream = () => {
    if (!monitoredStream) {
      return
    }

    monitoredStream.removeEventListener('addtrack', syncRoomCallTileAudioActivityMonitor)
    monitoredStream.removeEventListener('removetrack', syncRoomCallTileAudioActivityMonitor)
    monitoredStream = null
  }

  const syncRoomCallTileAudioActivityStream = () => {
    detachRoomCallTileAudioActivityStream()
    stopRoomCallTileAudioActivityMonitor()

    const stream = props.item.audioActivityStream

    if (!stream) {
      return
    }

    monitoredStream = stream
    monitoredStream.addEventListener('addtrack', syncRoomCallTileAudioActivityMonitor)
    monitoredStream.addEventListener('removetrack', syncRoomCallTileAudioActivityMonitor)
    syncRoomCallTileAudioActivityMonitor()
  }

  const toggleRemoteAudioMuted = () => {
    toggleRoomCallRemoteAudioMuted(props.item.id)
  }

  const toggleRemoteVideoHidden = () => {
    toggleRoomCallRemoteVideoHidden(props.item.id)
  }

  watch(() => props.item.audioActivityStream, syncRoomCallTileAudioActivityStream, { immediate: true })

  onBeforeUnmount(() => {
    detachRoomCallTileAudioActivityStream()
    stopRoomCallTileAudioActivityMonitor()
  })

  return {
    avatarImageSrc,
    isRemoteAudioMuted,
    isRemoteVideoHidden,
    isMediaTileVideoOff,
    isRoomCallParticipantTile,
    isRoomCallScreenTile,
    isRoomCallTileAudioMeterVisible,
    isRoomCallTileParticipantMediaStateVisible,
    isRoomCallTileQuickCommandsVisible,
    isRoomCallTileRemoteActionsVisible,
    roomCallTileAudioVolumeDb,
    roomCallConnectionQualityBarItems,
    roomCallConnectionQualityClass,
    remoteHideButtonText,
    remoteMuteButtonText,
    temporaryQuickCommandI18n,
    temporaryQuickCommandTextColor,
    toggleRemoteAudioMuted,
    toggleRemoteVideoHidden
  }
}
