import { isString } from 'global-shared'

import { ROUTE_TITLE_MAP } from '../app-layout/constants'

export type ContentNavigationTitleKey = keyof typeof ROUTE_TITLE_MAP

export const isContentNavigationTitleKey = (titleKey?: string): titleKey is ContentNavigationTitleKey =>
  isString(titleKey) && titleKey in ROUTE_TITLE_MAP

export interface ContentNavigationLayoutProps {
  titleKey?: ContentNavigationTitleKey
}
