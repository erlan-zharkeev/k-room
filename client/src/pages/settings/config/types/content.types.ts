import { SETTINGS_CONTENT_IDS } from '../constants/content.constants'

export type SettingsContentId = (typeof SETTINGS_CONTENT_IDS)[number]
export type SettingsContentWarningById = Record<SettingsContentId, boolean>
