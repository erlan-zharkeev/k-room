import moment from 'moment'

import { SliceContact } from 'src/entities/contact'

export const lastSeen = (timeStamp: number | undefined) =>
  timeStamp ? `last seen ${moment(timeStamp).startOf('minutes').fromNow()}` : ''

export const getContactDescription = (payload: SliceContact) => {
  const { online, interaction, lastSeen: timestamp } = payload
  let result
  if (interaction === 'invite-accepted') {
    result = online ? 'online' : lastSeen(timestamp)
  }
  return result
}
