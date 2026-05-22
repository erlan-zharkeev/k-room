import { formatLocalizedTime } from 'src/shared/lib'
import { useI18n } from 'src/shared/preferences'
import { AppText } from 'src/shared/ui'

import { MessageTimeProps } from './message-time.types.ts'

export const MessageTime = ({ createdAt }: MessageTimeProps) => {
  const { language } = useI18n()

  if (!createdAt) return null

  return <AppText size="extra-small">{formatLocalizedTime(createdAt, language)}</AppText>
}
