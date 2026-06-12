import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { calculateAudioVolumeDb, createAudioMeterAnalyser, log, useLiveMediaUrl } from 'src/shared/lib'

import {
  ROOM_CALL_TEMPORARY_QUICK_COMMAND_I18N_BY_COMMAND,
  ROOM_CALL_TILE_QUICK_COMMAND_MODIFIER_BY_COMMAND,
  ROOM_CALL_TILE_REMOTE_ACTION_TEXT
} from '../config/constants'
import type { RoomCallTileAudioActivityMonitor, RoomCallTileProps } from '../config/types'

export const useRoomCallTile = (props: RoomCallTileProps) => {
  const isRemoteAudioMuted = ref(false)
  const isRemoteVideoHidden = ref(false)
  const roomCallTileAudioVolumeDb = ref(Number.NEGATIVE_INFINITY)
  const avatarImageSrc = useLiveMediaUrl(() => props.item.avatarId)
  let audioActivityMonitor: RoomCallTileAudioActivityMonitor | null = null
  let monitoredStream: MediaStream | null = null
  const hasStream = computed(() => Boolean(props.item.stream))
  const hasVisibleVideo = computed(() => {
    const hasEnabledVideo = props.item.mediaState.video || props.item.mediaState.screen
    const hasLocalVideoVisibility = props.self || !isRemoteVideoHidden.value

    return hasEnabledVideo && hasStream.value && hasLocalVideoVisibility
  })
  const remoteHideButtonText = computed(() =>
    isRemoteVideoHidden.value ? ROOM_CALL_TILE_REMOTE_ACTION_TEXT.SHOW : ROOM_CALL_TILE_REMOTE_ACTION_TEXT.HIDE
  )
  const remoteMuteButtonText = computed(() =>
    isRemoteAudioMuted.value ? ROOM_CALL_TILE_REMOTE_ACTION_TEXT.UNMUTE : ROOM_CALL_TILE_REMOTE_ACTION_TEXT.MUTE
  )
  const isMediaTileVideoOff = computed(() => !hasVisibleVideo.value)
  const temporaryQuickCommandI18n = computed(() => {
    const quickCommand = props.item.temporaryQuickCommand?.command

    return quickCommand && ROOM_CALL_TEMPORARY_QUICK_COMMAND_I18N_BY_COMMAND[quickCommand]
  })
  const temporaryQuickCommandModifier = computed(() => {
    const quickCommand = props.item.temporaryQuickCommand?.command

    return quickCommand && ROOM_CALL_TILE_QUICK_COMMAND_MODIFIER_BY_COMMAND[quickCommand]
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
    isRemoteAudioMuted.value = !isRemoteAudioMuted.value
  }

  const toggleRemoteVideoHidden = () => {
    isRemoteVideoHidden.value = !isRemoteVideoHidden.value
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
    roomCallTileAudioVolumeDb,
    remoteHideButtonText,
    remoteMuteButtonText,
    temporaryQuickCommandI18n,
    temporaryQuickCommandModifier,
    toggleRemoteAudioMuted,
    toggleRemoteVideoHidden
  }
}
