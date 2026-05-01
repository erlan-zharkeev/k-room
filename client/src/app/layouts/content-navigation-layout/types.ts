import { isString } from 'global-shared'

import { CONTENT_NAVIGATION_TITLE } from './constants'

export type ContentNavigationTitleKey = keyof typeof CONTENT_NAVIGATION_TITLE

export const isContentNavigationTitleKey = (titleKey: string | undefined): titleKey is ContentNavigationTitleKey =>
  isString(titleKey) && titleKey in CONTENT_NAVIGATION_TITLE

export interface IContentNavigationLayoutProps {
  titleKey?: ContentNavigationTitleKey
}
