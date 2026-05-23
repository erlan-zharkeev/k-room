import type { EventMediaFilesDeleted, SocketActions } from 'global-shared'

import { useMedia } from 'src/entities/media-file'
import { socket } from 'src/shared/api'

export const useMediaUpdateMonitor = () => {
  const { bulkDelete } = useMedia()

  const removeDeletedMediaFiles = ({ mediaIds }: EventMediaFilesDeleted) => {
    void bulkDelete(mediaIds)
  }

  const initializeMediaUpdateMonitor = () => {
    socket.on<SocketActions>('media-files-deleted', removeDeletedMediaFiles)
  }

  const disposeMediaUpdateMonitor = () => {
    socket.off<SocketActions>('media-files-deleted', removeDeletedMediaFiles)
  }

  return {
    initializeMediaUpdateMonitor,
    disposeMediaUpdateMonitor
  }
}
