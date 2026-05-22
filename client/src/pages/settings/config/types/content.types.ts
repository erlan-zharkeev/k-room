import { SETTINGS_CONTENT_IDS } from '../constants/content.constants'

export type SettingsContentId = (typeof SETTINGS_CONTENT_IDS)[number]
export type SettingsContentWarningId = Extract<SettingsContentId, 'account' | 'devices' | 'storage'>
export type SettingsContentWarningById = Partial<Record<SettingsContentWarningId, boolean>>
