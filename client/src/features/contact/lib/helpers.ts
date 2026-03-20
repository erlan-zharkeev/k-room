import moment from 'moment'

import type { DbContactType, IDbContactRequiredSystemData } from 'src/shared/config'

export const lastSeen = (timeStamp: number | undefined) =>
  timeStamp ? `last seen ${moment(timeStamp).startOf('minutes').fromNow()}` : ''

export const getContactDescription = (payload: DbContactType) => {
  const { online, interactionType, lastSeen: timestamp } = payload
  let result
  if (interactionType === 'invite-accepted') {
    result = online ? 'online' : lastSeen(timestamp)
  }
  return result
}

export const getRequiredContactSystemData = (): IDbContactRequiredSystemData => ({
  onlineStatusSyncedAt: Date.now(),
  isTyping: false
})
