import { isFunction } from 'global-shared'

import type { FaqDynamicText, FaqTextValue } from '../config/types/faq.types'

export const resolveFaqText = (value: FaqTextValue, appName: string): string => {
  if (!isFunction(value)) return value as string

  return (value as FaqDynamicText)(appName)
}
