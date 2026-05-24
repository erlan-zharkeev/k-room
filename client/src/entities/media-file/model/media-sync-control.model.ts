import { allowMediaSyncQueue, blockMediaSyncQueue } from '../lib/media-sync-queue'

import { abortMediaRequests, resetMediaRequests } from './use-load-media.model'

export const blockMediaSync = () => {
  blockMediaSyncQueue()
  abortMediaRequests()
}

export const allowMediaSync = () => {
  resetMediaRequests()
  allowMediaSyncQueue()
}
