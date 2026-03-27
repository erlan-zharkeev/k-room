import { useI18n } from 'src/entities/system'

import { formatLocalizedTime } from 'src/shared/lib'
import { AppText } from 'src/shared/ui'

export const MessageTime = ({ createdAt }: { createdAt?: number }) => {
  const { language } = useI18n()

  if (!createdAt) return null

  return <AppText size="extra-small">{formatLocalizedTime(createdAt, language)}</AppText>
}
