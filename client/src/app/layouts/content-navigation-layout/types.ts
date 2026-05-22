import { isString } from 'lodash'

import { CONTENT_NAVIGATION_TITLE } from './constants'

export type ContentNavigationTitleKeyType = keyof typeof CONTENT_NAVIGATION_TITLE

export const isContentNavigationTitleKey = (titleKey?: string): titleKey is ContentNavigationTitleKeyType =>
  isString(titleKey) && titleKey in CONTENT_NAVIGATION_TITLE

export interface IContentNavigationLayoutProps {
  titleKey?: ContentNavigationTitleKeyType
}
