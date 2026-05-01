import { isString } from 'lodash'

import { DEFAULT_SETTINGS_CONTENT_ID, SETTINGS_CONTENT_COMPONENTS } from '../config/constants'
import type { SettingsContentId } from '../types'

const isSettingsContentId = (settingsId: string | string[] | undefined): settingsId is SettingsContentId =>
  isString(settingsId) && settingsId in SETTINGS_CONTENT_COMPONENTS

export const getSettingsContentId = (settingsId: string | string[] | undefined): SettingsContentId => {
  return isSettingsContentId(settingsId) ? settingsId : DEFAULT_SETTINGS_CONTENT_ID
}
