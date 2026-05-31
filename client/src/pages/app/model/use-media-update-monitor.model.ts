import type { EventMediaFilesDeleted } from 'global-shared'

import { useMedia } from 'src/entities/media-file'
import { socket } from 'src/shared/api'

export const useMediaUpdateMonitor = () => {
  const { bulkDelete } = useMedia()

  const removeDeletedMediaFiles = ({ mediaIds }: EventMediaFilesDeleted) => {
    void bulkDelete(mediaIds)
  }

  const initializeMediaUpdateMonitor = () => {
    socket.on('media-files-deleted', removeDeletedMediaFiles)
  }

  const disposeMediaUpdateMonitor = () => {
    socket.off('media-files-deleted', removeDeletedMediaFiles)
  }

  return {
    initializeMediaUpdateMonitor,
    disposeMediaUpdateMonitor
  }
}
