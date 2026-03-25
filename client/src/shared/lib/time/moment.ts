import { APP_LANGUAGE, type AppLanguageType } from 'common'
import moment from 'moment'
import 'moment/locale/ru'

const getMomentLocale = (language: AppLanguageType) => (language === APP_LANGUAGE.Ru ? 'ru' : 'en')

export const formatLocalizedDate = (
  value: number | string,
  language: AppLanguageType,
  format = 'LL'
) => moment(Number(value)).locale(getMomentLocale(language)).format(format)

export const formatLocalizedTime = (
  value: number | string,
  language: AppLanguageType,
  format = 'LT'
) => moment(Number(value)).locale(getMomentLocale(language)).format(format)

export const formatLocalizedRelativeTime = (value: number | string, language: AppLanguageType) =>
  moment(Number(value)).locale(getMomentLocale(language)).startOf('minutes').fromNow()
