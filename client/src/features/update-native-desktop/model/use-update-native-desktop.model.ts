import { relaunch } from '@tauri-apps/plugin-process'
import { check } from '@tauri-apps/plugin-updater'
import type { DownloadEvent, Update } from '@tauri-apps/plugin-updater'
import { computed, onMounted, ref, shallowRef } from 'vue'

import { getClientPlatform } from 'src/shared/lib'

import {
  UPDATE_NATIVE_DESKTOP_CHECK_TIMEOUT_MS,
  UPDATE_NATIVE_DESKTOP_DOWNLOAD_PROGRESS_MAX
} from '../config/constants'
import type { UpdateNativeDesktopStatus } from '../config/types'

export const useUpdateNativeDesktop = () => {
  const platform = getClientPlatform()
  const isNativeDesktopClient = platform === 'native'
  const pendingUpdate = shallowRef<Update | null>(null)
  const updateStatus = ref<UpdateNativeDesktopStatus>('idle')
  const updateVersion = ref('')
  const downloadedBytes = ref(0)
  const downloadContentLength = ref(0)
  const downloadProgress = ref(0)

  const isInstalling = computed(() => updateStatus.value === 'installing')
  const hasInstallError = computed(() => updateStatus.value === 'failed')
  const showUpdateNativeDesktopBanner = computed(() => {
    const hasPendingUpdate = Boolean(pendingUpdate.value)
    const isUpdateInstalled = updateStatus.value === 'installed'
    const canShowUpdateBanner = isNativeDesktopClient && hasPendingUpdate

    return canShowUpdateBanner && !isUpdateInstalled
  })

  const checkUpdateNativeDesktop = async () => {
    const isChecking = updateStatus.value === 'checking'
    const isCheckAvailable = isNativeDesktopClient && !isChecking

    if (!isCheckAvailable || isInstalling.value) return

    updateStatus.value = 'checking'

    try {
      const nextUpdate = await check({ timeout: UPDATE_NATIVE_DESKTOP_CHECK_TIMEOUT_MS })

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
          UPDATE_NATIVE_DESKTOP_DOWNLOAD_PROGRESS_MAX,
          Math.round(
            (downloadedBytes.value / downloadContentLength.value) * UPDATE_NATIVE_DESKTOP_DOWNLOAD_PROGRESS_MAX
          )
        )
      }

      return
    }

    downloadProgress.value = UPDATE_NATIVE_DESKTOP_DOWNLOAD_PROGRESS_MAX
  }

  const installUpdateNativeDesktop = async () => {
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

  const dismissUpdateNativeDesktop = () => {
    pendingUpdate.value = null
    updateStatus.value = 'idle'
  }

  onMounted(checkUpdateNativeDesktop)

  return {
    dismissUpdateNativeDesktop,
    downloadProgress,
    hasInstallError,
    installUpdateNativeDesktop,
    isInstalling,
    showUpdateNativeDesktopBanner,
    updateVersion
  }
}
