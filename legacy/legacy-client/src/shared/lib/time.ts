import moment from 'moment'

import { APP_LANGUAGE, AppLanguage, normalizeTimestamp } from 'common'

import 'moment/locale/ru'

const getMomentLocale = (language: AppLanguage) => (language === APP_LANGUAGE.Ru ? 'ru' : 'en')

export const formatLocalizedDate = (value: number | string, language: AppLanguage, format = 'LL') =>
  moment(normalizeTimestamp(value) ?? 0)
    .locale(getMomentLocale(language))
    .format(format)

export const formatLocalizedTime = (value: number | string, language: AppLanguage, format = 'LT') =>
  moment(normalizeTimestamp(value) ?? 0)
    .locale(getMomentLocale(language))
    .format(format)

export const formatLocalizedRelativeTime = (value: number | string, language: AppLanguage) =>
  moment(normalizeTimestamp(value) ?? 0)
    .locale(getMomentLocale(language))
    .startOf('minutes')
    .fromNow()
