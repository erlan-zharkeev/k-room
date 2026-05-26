import { isString } from 'global-shared'

import { SETTINGS_CONTENT_TITLE } from 'src/pages/settings'

export type ContentTitleKey = keyof typeof SETTINGS_CONTENT_TITLE

export const isContentTitleKey = (titleKey?: string): titleKey is ContentTitleKey =>
  isString(titleKey) && titleKey in SETTINGS_CONTENT_TITLE

export interface ContentLayoutProps {
  titleKey?: ContentTitleKey
}
