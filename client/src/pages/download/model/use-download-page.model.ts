import { computed, onMounted, ref } from 'vue'

import type { DownloadPlatformItem, DownloadReleasesManifest } from '../config/types'
import { loadDownloadReleasesManifest } from '../lib/load-download-releases-manifest'

export const useDownloadPage = () => {
  const releasesManifest = ref<DownloadReleasesManifest | null>(null)
  const isLoading = ref(false)
  const hasLoadError = ref(false)
  const { appVersion } = __CLIENT_ENV_DATA__

  const loadReleasesManifest = async () => {
    isLoading.value = true
    hasLoadError.value = false

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
  const downloadPlatformItem = ({ downloadUrl, fileName }: DownloadPlatformItem) => {
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
    hasLoadError,
    isLoading,
    loadReleasesManifest,
    platformItems,
    releasedAt,
    showPlatformItems,
    showReleasedAt
  }
}
