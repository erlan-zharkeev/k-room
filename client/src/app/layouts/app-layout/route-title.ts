import { isString } from 'global-shared'

import { SETTINGS_CONTENT_TITLE } from 'src/pages/settings'

import type { ContentTitleKey } from '../content-layout/types'
import type { ContentNavigationTitleKey } from '../content-navigation-layout/types'

import { ROUTE_TITLE_MAP } from './constants'

export const isContentTitleKey = (titleKey?: string): titleKey is ContentTitleKey => {
  return isString(titleKey) && titleKey in SETTINGS_CONTENT_TITLE
}

export const isContentNavigationTitleKey = (titleKey?: string): titleKey is ContentNavigationTitleKey => {
  return isString(titleKey) && titleKey in ROUTE_TITLE_MAP
}
