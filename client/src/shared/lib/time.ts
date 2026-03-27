import { APP_LANGUAGE, type AppLanguageType } from 'common'
import moment from 'moment'
import 'moment/locale/ru'

const getMomentLocale = (language: AppLanguageType) => (language === APP_LANGUAGE.Ru ? 'ru' : 'en')

const parseTimestamp = (value: number | string): number => {
  const n = Number(value)
  return isNaN(n) ? new Date(value).getTime() : n
}

export const formatLocalizedDate = (
  value: number | string,
  language: AppLanguageType,
  format = 'LL'
) => moment(parseTimestamp(value)).locale(getMomentLocale(language)).format(format)

export const formatLocalizedTime = (
  value: number | string,
  language: AppLanguageType,
  format = 'LT'
) => moment(parseTimestamp(value)).locale(getMomentLocale(language)).format(format)

export const formatLocalizedRelativeTime = (value: number | string, language: AppLanguageType) =>
  moment(parseTimestamp(value)).locale(getMomentLocale(language)).startOf('minutes').fromNow()
