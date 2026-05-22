import { MEDIA_CACHE_TRIM_MIN_RECORDS, MEDIA_CACHE_TRIM_TARGET_BYTES } from '../config/constants'

import type { TrimMediaCacheDeps } from './types'

export const trimMediaCache = async ({ deleteMediaRecords, loadMediaRecords }: TrimMediaCacheDeps) => {
  const records = await loadMediaRecords()
  const candidates = records
    .flatMap((record) =>
      record.blob ? [{ id: record.id, lastChecked: record.lastChecked, size: record.blob.size }] : []
    )
    .sort((first, second) => {
      const checkedDiff = first.lastChecked - second.lastChecked

      if (checkedDiff) return checkedDiff

      return second.size - first.size
    })

  if (!candidates.length) return { trimmed: false }

  const idsToDelete: string[] = []
  let bytesToDelete = 0

  for (const candidate of candidates) {
    idsToDelete.push(candidate.id)
    bytesToDelete += candidate.size

    const hasEnoughBytes = bytesToDelete >= MEDIA_CACHE_TRIM_TARGET_BYTES
    const hasEnoughRecords = idsToDelete.length >= MEDIA_CACHE_TRIM_MIN_RECORDS

    if (hasEnoughBytes || hasEnoughRecords) break
  }

  await deleteMediaRecords(idsToDelete)

  return { trimmed: true }
}
