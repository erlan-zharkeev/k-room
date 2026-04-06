import { IMessageTimeProps } from 'src/features/message'

import { formatLocalizedTime } from 'src/shared/lib'
import { useI18n } from 'src/shared/settings'
import { AppText } from 'src/shared/ui'

export const MessageTime = ({ createdAt }: IMessageTimeProps) => {
  const { language } = useI18n()

  if (!createdAt) return null

  return <AppText size="extra-small">{formatLocalizedTime(createdAt, language)}</AppText>
}
