import { isString } from 'lodash'

import { DEFAULT_SETTINGS_CONTENT_ID, SETTINGS_CONTENT_COMPONENTS } from '../config/constants/content.constants'
import type { SettingsContentIdType } from '../config/types/content.types'

const isSettingsContentId = (settingsId: string | string[] | undefined): settingsId is SettingsContentIdType =>
  isString(settingsId) && settingsId in SETTINGS_CONTENT_COMPONENTS

export const getSettingsContentId = (settingsId: string | string[] | undefined): SettingsContentIdType => {
  return isSettingsContentId(settingsId) ? settingsId : DEFAULT_SETTINGS_CONTENT_ID
}
