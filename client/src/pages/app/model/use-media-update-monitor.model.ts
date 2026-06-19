import type { EventMediaFilesDeleted } from 'global-shared'

import { useMedia } from 'src/entities/media-file'
import { registerSocketEventListeners } from 'src/shared/api'

export const useMediaUpdateMonitor = () => {
  const { bulkDelete } = useMedia()
  let disposeMediaUpdateMonitorListeners: (() => void) | null = null

  const removeDeletedMediaFiles = ({ mediaIds }: EventMediaFilesDeleted) => {
    void bulkDelete(mediaIds)
  }

  const initializeMediaUpdateMonitor = () => {
    disposeMediaUpdateMonitorListeners = registerSocketEventListeners([
      ['media-files-deleted', removeDeletedMediaFiles]
    ])
  }

  const disposeMediaUpdateMonitor = () => {
    disposeMediaUpdateMonitorListeners?.()
    disposeMediaUpdateMonitorListeners = null
  }

  return {
    initializeMediaUpdateMonitor,
    disposeMediaUpdateMonitor
  }
}
