import { AppLanguageType } from 'common'

import { formatLocalizedDate } from 'src/shared/lib'

export const getMessageGroupDateLabel = (createdAt: number | undefined, language: AppLanguageType) => {
  if (!createdAt) return ''

  return formatLocalizedDate(createdAt, language)
}
