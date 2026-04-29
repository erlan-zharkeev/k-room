import { CONTENT_TITLE } from './constants'

export type ContentTitleKey = keyof typeof CONTENT_TITLE

export const isContentTitleKey = (titleKey: unknown): titleKey is ContentTitleKey =>
  typeof titleKey === 'string' && titleKey in CONTENT_TITLE

export interface IContentLayoutProps {
  titleKey?: ContentTitleKey
}
