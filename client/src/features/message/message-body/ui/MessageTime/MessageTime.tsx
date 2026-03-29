
import { useI18n } from 'src/entities/system'

import { formatLocalizedTime } from 'src/shared/lib'
import { AppText } from 'src/shared/ui'

import type { IMessageTimeProps } from '../..'

export const MessageTime = ({ createdAt }: IMessageTimeProps) => {
  const { language } = useI18n()

  if (!createdAt) return null

  return <AppText size="extra-small">{formatLocalizedTime(createdAt, language)}</AppText>
}
