import { isString } from 'global-shared'

import { DEFAULT_SETTINGS_CONTENT_ID, SETTINGS_CONTENT_COMPONENTS } from '../config/constants/content.constants'
import type { SettingsContentId } from '../config/types/content.types'

const isSettingsContentId = (settingsId?: string | string[]): settingsId is SettingsContentId =>
  isString(settingsId) && settingsId in SETTINGS_CONTENT_COMPONENTS

export const getSettingsContentId = (settingsId?: string | string[]): SettingsContentId => {
  return isSettingsContentId(settingsId) ? settingsId : DEFAULT_SETTINGS_CONTENT_ID
}
