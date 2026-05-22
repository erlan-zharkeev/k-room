import { isString } from 'lodash'

import { CONTENT_TITLE } from './constants'

export type ContentTitleKeyType = keyof typeof CONTENT_TITLE

export const isContentTitleKey = (titleKey?: string): titleKey is ContentTitleKeyType =>
  isString(titleKey) && titleKey in CONTENT_TITLE

export interface IContentLayoutProps {
  titleKey?: ContentTitleKeyType
}
