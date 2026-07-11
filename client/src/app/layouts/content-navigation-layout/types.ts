import { ROUTE_TITLE_MAP } from '../app-layout/constants'

export type ContentNavigationTitleKey = keyof typeof ROUTE_TITLE_MAP

export interface ContentNavigationLayoutProps {
  titleKey?: ContentNavigationTitleKey
}
