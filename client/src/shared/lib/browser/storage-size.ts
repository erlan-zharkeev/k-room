import { MEDIA_MB_IN_BYTES } from 'global-shared'

const GB = MEDIA_MB_IN_BYTES * 1024

export const formatBytes = (bytes: number): string => {
  if (bytes >= GB) {
    return `${(bytes / GB).toFixed(2)} GB`
  }

  return `${Math.round(bytes / MEDIA_MB_IN_BYTES)} MB`
}
