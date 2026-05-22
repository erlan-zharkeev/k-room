import { AppLanguage } from 'common'

import { formatLocalizedDate } from 'src/shared/lib'

export const getMessageGroupDateLabel = (createdAt: number | undefined, language: AppLanguage) => {
  if (!createdAt) return ''

  return formatLocalizedDate(createdAt, language)
}
