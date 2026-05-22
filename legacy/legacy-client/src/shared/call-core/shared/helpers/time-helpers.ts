import moment from 'moment'

import { AppLanguage } from 'common'

import { formatLocalizedDate, formatLocalizedTime } from 'src/shared/lib'

export const callCounter = (value: number) => moment.utc(value * 1000).format('HH:mm:ss')
export const getCallLength = (value: number) => moment.utc(value * 1000).format('mm:ss')
export const callDate = (value: number, language: AppLanguage) => formatLocalizedDate(value, language)
export const callTime = (value: number, language: AppLanguage) => formatLocalizedTime(value, language, 'LTS')
