import moment from 'moment'

export const getMessageGroupDateLabel = (createdAt?: string) => {
  if (!createdAt) return ''

  return moment(Number(createdAt)).format('LL')
}
