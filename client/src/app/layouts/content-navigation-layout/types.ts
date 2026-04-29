import { CONTENT_NAVIGATION_TITLE } from './constants'

export type ContentNavigationTitleKey = keyof typeof CONTENT_NAVIGATION_TITLE

export const isContentNavigationTitleKey = (titleKey: unknown): titleKey is ContentNavigationTitleKey =>
  typeof titleKey === 'string' && titleKey in CONTENT_NAVIGATION_TITLE

export interface IContentNavigationLayoutProps {
  titleKey?: ContentNavigationTitleKey
}
