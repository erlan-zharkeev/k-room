import { isString } from 'global-shared'

import { CONTENT_TITLE } from './constants'

export type ContentTitleKey = keyof typeof CONTENT_TITLE

export const isContentTitleKey = (titleKey: string | undefined): titleKey is ContentTitleKey =>
  isString(titleKey) && titleKey in CONTENT_TITLE

export interface IContentLayoutProps {
  titleKey?: ContentTitleKey
}
