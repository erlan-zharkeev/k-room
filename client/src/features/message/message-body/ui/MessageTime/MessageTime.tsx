import moment from 'moment'

import { AppText } from 'src/shared/ui'

export const MessageTime = ({ createdAt }: { createdAt?: string }) => {
  if (!createdAt) return null
  return <AppText size="extra-small">{moment(Number(createdAt)).format('HH:mm')}</AppText>
}
