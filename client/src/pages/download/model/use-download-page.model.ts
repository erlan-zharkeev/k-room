import { computed, onMounted, ref } from 'vue'

import type { DownloadPlatformId, DownloadPlatformItem, DownloadReleasesManifest } from '../config/types'
import { isDownloadFileAvailable } from '../lib/is-download-file-available'
import { loadDownloadReleasesManifest } from '../lib/load-download-releases-manifest'

export const useDownloadPage = () => {
  const releasesManifest = ref<DownloadReleasesManifest | null>(null)
  const isLoading = ref(false)
  const hasLoadError = ref(false)
  const hasDownloadError = ref(false)
  const downloadingPlatformId = ref<DownloadPlatformId | null>(null)
  const { appVersion } = __CLIENT_ENV_DATA__

  const loadReleasesManifest = async () => {
    isLoading.value = true
    hasLoadError.value = false
    hasDownloadError.value = false

    try {
      const parsedManifest = await loadDownloadReleasesManifest()

      if (!parsedManifest) {
        hasLoadError.value = true

        return
      }

      releasesManifest.value = parsedManifest
      hasLoadError.value = false
    } catch {
      hasLoadError.value = true
    } finally {
      isLoading.value = false
    }
  }

  const platformItems = computed(() => {
    const manifest = releasesManifest.value

    return manifest ? manifest.platformItems : []
  })

  const releasedAt = computed(() => {
    const manifest = releasesManifest.value

    return manifest ? manifest.releasedAt : ''
  })
  const showPlatformItems = computed(() => {
    const hasPlatformItems = platformItems.value.length > 0
    const canShowPlatformItems = !isLoading.value && !hasLoadError.value

    return canShowPlatformItems && hasPlatformItems
  })
  const showReleasedAt = computed(() => Boolean(releasedAt.value))
  const isDownloading = computed(() => Boolean(downloadingPlatformId.value))
  const isPlatformDownloading = (platformId: DownloadPlatformId) => downloadingPlatformId.value === platformId
  const downloadPlatformItem = async ({ platformId, downloadUrl, fileName }: DownloadPlatformItem) => {
    hasDownloadError.value = false
    downloadingPlatformId.value = platformId

    try {
      if (!(await isDownloadFileAvailable(downloadUrl))) {
        hasDownloadError.value = true

        return
      }
    } catch {
      hasDownloadError.value = true

      return
    } finally {
      downloadingPlatformId.value = null
    }

    const link = document.createElement('a')

    link.href = downloadUrl
    link.download = fileName
    document.body.append(link)
    link.click()
    link.remove()
  }

  onMounted(loadReleasesManifest)

  return {
    appVersion,
    downloadPlatformItem,
    hasDownloadError,
    hasLoadError,
    isDownloading,
    isLoading,
    isPlatformDownloading,
    loadReleasesManifest,
    platformItems,
    releasedAt,
    showPlatformItems,
    showReleasedAt
  }
}
