import { relaunch } from '@tauri-apps/plugin-process'
import { check } from '@tauri-apps/plugin-updater'
import type { DownloadEvent, Update } from '@tauri-apps/plugin-updater'
import { computed, onMounted, ref, shallowRef } from 'vue'

import { getClientPlatform } from 'src/shared/lib'

import {
  NATIVE_DESKTOP_UPDATE_CHECK_TIMEOUT_MS,
  NATIVE_DESKTOP_UPDATE_DOWNLOAD_PROGRESS_MAX
} from '../config/constants'
import type { NativeDesktopUpdateStatus } from '../config/types'

export const useNativeDesktopUpdate = () => {
  const platform = getClientPlatform()
  const isNativeDesktopClient = platform === 'native'
  const pendingUpdate = shallowRef<Update | null>(null)
  const updateStatus = ref<NativeDesktopUpdateStatus>('idle')
  const updateVersion = ref('')
  const downloadedBytes = ref(0)
  const downloadContentLength = ref(0)
  const downloadProgress = ref(0)

  const isInstalling = computed(() => updateStatus.value === 'installing')
  const hasInstallError = computed(() => updateStatus.value === 'failed')
  const showNativeDesktopUpdateBanner = computed(() => {
    const hasPendingUpdate = Boolean(pendingUpdate.value)
    const isUpdateInstalled = updateStatus.value === 'installed'
    const canShowUpdateBanner = isNativeDesktopClient && hasPendingUpdate

    return canShowUpdateBanner && !isUpdateInstalled
  })

  const checkNativeDesktopUpdate = async () => {
    const isChecking = updateStatus.value === 'checking'
    const isCheckAvailable = isNativeDesktopClient && !isChecking

    if (!isCheckAvailable || isInstalling.value) return

    updateStatus.value = 'checking'

    try {
      const nextUpdate = await check({ timeout: NATIVE_DESKTOP_UPDATE_CHECK_TIMEOUT_MS })

      if (!nextUpdate) {
        updateStatus.value = 'idle'

        return
      }

      pendingUpdate.value = nextUpdate
      updateVersion.value = nextUpdate.version
      updateStatus.value = 'available'
    } catch {
      updateStatus.value = 'idle'
    }
  }

  const updateDownloadProgress = (event: DownloadEvent) => {
    if (event.event === 'Started') {
      downloadedBytes.value = 0
      downloadContentLength.value = event.data.contentLength ?? 0
      downloadProgress.value = 0

      return
    }

    if (event.event === 'Progress') {
      downloadedBytes.value += event.data.chunkLength

      if (downloadContentLength.value > 0) {
        downloadProgress.value = Math.min(
          NATIVE_DESKTOP_UPDATE_DOWNLOAD_PROGRESS_MAX,
          Math.round(
            (downloadedBytes.value / downloadContentLength.value) * NATIVE_DESKTOP_UPDATE_DOWNLOAD_PROGRESS_MAX
          )
        )
      }

      return
    }

    downloadProgress.value = NATIVE_DESKTOP_UPDATE_DOWNLOAD_PROGRESS_MAX
  }

  const installNativeDesktopUpdate = async () => {
    const availableUpdate = pendingUpdate.value

    if (!availableUpdate || isInstalling.value) return

    updateStatus.value = 'installing'

    try {
      await availableUpdate.downloadAndInstall(updateDownloadProgress)
      updateStatus.value = 'installed'
      await relaunch()
    } catch {
      updateStatus.value = 'failed'
    }
  }

  const dismissNativeDesktopUpdate = () => {
    pendingUpdate.value = null
    updateStatus.value = 'idle'
  }

  onMounted(checkNativeDesktopUpdate)

  return {
    dismissNativeDesktopUpdate,
    downloadProgress,
    hasInstallError,
    installNativeDesktopUpdate,
    isInstalling,
    showNativeDesktopUpdateBanner,
    updateVersion
  }
}
