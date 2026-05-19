import {
  formatLocalizedDate,
  formatLocalizedDateTime,
  formatLocalizedRelativeTime,
  formatLocalizedTime
} from 'src/shared/lib'

import { useSettings } from './use-settings.model'

export const useLocalizedDateTime = () => {
  const { settings } = useSettings()

  const formatDate = (value: number | string) =>
    formatLocalizedDate(value, settings.value.localization.language, settings.value.localization.dateTimeFormat)

  const formatTime = (value: number | string) =>
    formatLocalizedTime(value, settings.value.localization.language, settings.value.localization.dateTimeFormat)

  const formatDateTime = (value: number | string) =>
    formatLocalizedDateTime(value, settings.value.localization.language, settings.value.localization.dateTimeFormat)

  const formatRelativeTime = (value: number | string) =>
    formatLocalizedRelativeTime(value, settings.value.localization.language)

  return {
    formatDate,
    formatTime,
    formatDateTime,
    formatRelativeTime
  }
}
