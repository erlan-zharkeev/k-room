export type DownloadPlatformId = 'windows' | 'macos'

export interface DownloadPlatformManifestItem {
  label: string
  fileName: string
  downloadUrl: string
}

export interface DownloadPlatformItem extends DownloadPlatformManifestItem {
  platformId: DownloadPlatformId
}

export interface DownloadReleasesManifest {
  releasedAt: string
  platformItems: DownloadPlatformItem[]
}
