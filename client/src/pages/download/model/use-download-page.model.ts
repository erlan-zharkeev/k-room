import { computed, onMounted, ref } from 'vue'

import { DOWNLOAD_RELEASES_MANIFEST_URL } from '../config/constants'
import type { DownloadPlatformItem, DownloadReleasesManifest } from '../config/types'
import { parseDownloadReleasesManifest } from '../lib/parse-download-releases-manifest'

export const useDownloadPage = () => {
  const releasesManifest = ref<DownloadReleasesManifest | null>(null)
  const isLoading = ref(false)
  const hasLoadError = ref(false)
  const { appVersion } = __CLIENT_ENV_DATA__

  const loadReleasesManifest = async () => {
    isLoading.value = true
    hasLoadError.value = false

    try {
      const response = await fetch(DOWNLOAD_RELEASES_MANIFEST_URL)

      if (!response.ok) {
        hasLoadError.value = true

        return
      }

      const source: unknown = await response.json()
      const parsedManifest = parseDownloadReleasesManifest(source)

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
