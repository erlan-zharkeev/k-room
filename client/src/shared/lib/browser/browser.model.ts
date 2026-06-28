import { useMediaQuery, usePermission } from '@vueuse/core'
import { computed, ref } from 'vue'

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

const resolveMediaDevicePermission = (
  permission: PermissionState | undefined,
  detectedPermission: PermissionState | undefined
) => {
  if (permission === 'denied') return permission

  return detectedPermission ?? permission
}

const createMediaDevicePermission = () => {
  const browserAudioInputPermission = usePermission('microphone')
  const browserVideoInputPermission = usePermission('camera')
  const detectedAudioInputPermission = ref<PermissionState>()
  const detectedVideoInputPermission = ref<PermissionState>()
  const audioInputPermission = computed(() =>
    resolveMediaDevicePermission(browserAudioInputPermission.value, detectedAudioInputPermission.value)
  )
  const videoInputPermission = computed(() =>
    resolveMediaDevicePermission(browserVideoInputPermission.value, detectedVideoInputPermission.value)
  )
  const markAudioInputPermissionGranted = () => {
    detectedAudioInputPermission.value = 'granted'
  }
  const markAudioInputPermissionDenied = () => {
    detectedAudioInputPermission.value = 'denied'
  }
  const markVideoInputPermissionGranted = () => {
    detectedVideoInputPermission.value = 'granted'
  }
  const markVideoInputPermissionDenied = () => {
    detectedVideoInputPermission.value = 'denied'
  }

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
    hasMediaDevicePermissionWarning,
    markAudioInputPermissionGranted,
    markAudioInputPermissionDenied,
    markVideoInputPermissionGranted,
    markVideoInputPermissionDenied
  }
}

let mediaDevicePermission: ReturnType<typeof createMediaDevicePermission> | undefined

export const useMediaDevicePermission = () => {
  if (!mediaDevicePermission) {
    mediaDevicePermission = createMediaDevicePermission()
  }

  return mediaDevicePermission
}
