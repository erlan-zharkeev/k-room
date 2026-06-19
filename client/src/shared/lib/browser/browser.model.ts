import { useMediaQuery, usePermission } from '@vueuse/core'
import { computed } from 'vue'

export const useTouchInput = () => {
  const isCoarsePointer = useMediaQuery('(pointer: coarse)')
  const hasHover = useMediaQuery('(hover: hover)')
  const isTouchAvailable = computed(() => navigator.maxTouchPoints > 0)
  const hasPrimaryTouchSignals = computed(() => isTouchAvailable.value && isCoarsePointer.value)
  const isTouchInput = computed(() => hasPrimaryTouchSignals.value && !hasHover.value)

  return {
    hasHover,
    isCoarsePointer,
    isTouchAvailable,
    isTouchInput
  }
}

const isMediaDevicePermissionWarning = (permission: PermissionState | undefined) => permission !== 'granted'

const createMediaDevicePermission = () => {
  const audioInputPermission = usePermission('microphone')
  const videoInputPermission = usePermission('camera')

  const hasAudioInputPermissionWarning = computed(() => isMediaDevicePermissionWarning(audioInputPermission.value))
  const hasVideoInputPermissionWarning = computed(() => isMediaDevicePermissionWarning(videoInputPermission.value))
  const hasMediaDevicePermissionWarning = computed(
    () => hasAudioInputPermissionWarning.value || hasVideoInputPermissionWarning.value
  )

  return {
    audioInputPermission,
    videoInputPermission,
    hasAudioInputPermissionWarning,
    hasVideoInputPermissionWarning,
    hasMediaDevicePermissionWarning
  }
}

let mediaDevicePermission: ReturnType<typeof createMediaDevicePermission> | undefined

export const useMediaDevicePermission = () => {
  if (!mediaDevicePermission) {
    mediaDevicePermission = createMediaDevicePermission()
  }

  return mediaDevicePermission
}
