import type { IMessageTimeProps } from 'src/features/message/message-body'

import { useI18n } from 'src/entities/system'

import { formatLocalizedTime } from 'src/shared/lib'
import { AppText } from 'src/shared/ui'

export const MessageTime = ({ createdAt }: IMessageTimeProps) => {
  const { language } = useI18n()

  if (!createdAt) return null

  return <AppText size="extra-small">{formatLocalizedTime(createdAt, language)}</AppText>
}
