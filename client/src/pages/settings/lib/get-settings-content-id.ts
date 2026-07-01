import { isString } from 'global-shared'

import { DEFAULT_SETTINGS_CONTENT_ID, SETTINGS_CONTENT_IDS } from '../config/constants/content.constants'
import type { SettingsContentId } from '../config/types/content.types'

const isSettingsContentId = (settingsId?: string | string[]): settingsId is SettingsContentId =>
  isString(settingsId) && SETTINGS_CONTENT_IDS.some((settingsContentId) => settingsContentId === settingsId)

export const getSettingsContentId = (settingsId?: string | string[]): SettingsContentId => {
  return isSettingsContentId(settingsId) ? settingsId : DEFAULT_SETTINGS_CONTENT_ID
}
