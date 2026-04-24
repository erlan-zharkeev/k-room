import moment from 'moment'

import { APP_LANGUAGE, AppLanguageType, normalizeTimestamp } from 'common'

import 'moment/locale/ru'

const getMomentLocale = (language: AppLanguageType) => (language === APP_LANGUAGE.Ru ? 'ru' : 'en')

export const formatLocalizedDate = (value: number | string, language: AppLanguageType, format = 'LL') =>
  moment(normalizeTimestamp(value) ?? 0)
    .locale(getMomentLocale(language))
    .format(format)

export const formatLocalizedTime = (value: number | string, language: AppLanguageType, format = 'LT') =>
  moment(normalizeTimestamp(value) ?? 0)
    .locale(getMomentLocale(language))
    .format(format)

export const formatLocalizedRelativeTime = (value: number | string, language: AppLanguageType) =>
  moment(normalizeTimestamp(value) ?? 0)
    .locale(getMomentLocale(language))
    .startOf('minutes')
    .fromNow()
