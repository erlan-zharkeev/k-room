import { SETTINGS_CONTENT_TITLE } from 'src/pages/settings'

export type ContentTitleKey = keyof typeof SETTINGS_CONTENT_TITLE

export interface ContentLayoutProps {
  titleKey?: ContentTitleKey
}
