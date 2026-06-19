import { allowMediaSyncQueue, blockMediaSyncQueue } from '../lib/media-sync-queue'

import { abortMediaRequests, resetMediaRequests } from './media-request-control.model'

export const blockMediaSync = () => {
  blockMediaSyncQueue()
  abortMediaRequests()
}

export const allowMediaSync = () => {
  resetMediaRequests()
  allowMediaSyncQueue()
}
