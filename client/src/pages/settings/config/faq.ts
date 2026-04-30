import type { LocalizedTextType } from 'global-shared'

import { SETTINGS_PAGE_I18N } from './i18n'

export interface IFaqItem {
  id: number
  question: LocalizedTextType<string>
  answer: LocalizedTextType<string>
}

export const FAQ_ITEMS: IFaqItem[] = [
  { id: 1, question: SETTINGS_PAGE_I18N.faqQ1, answer: SETTINGS_PAGE_I18N.faqA1 },
  { id: 2, question: SETTINGS_PAGE_I18N.faqQ2, answer: SETTINGS_PAGE_I18N.faqA2 },
  { id: 3, question: SETTINGS_PAGE_I18N.faqQ3, answer: SETTINGS_PAGE_I18N.faqA3 },
  { id: 4, question: SETTINGS_PAGE_I18N.faqQ4, answer: SETTINGS_PAGE_I18N.faqA4 },
  { id: 5, question: SETTINGS_PAGE_I18N.faqQ5, answer: SETTINGS_PAGE_I18N.faqA5 },
  { id: 6, question: SETTINGS_PAGE_I18N.faqQ6, answer: SETTINGS_PAGE_I18N.faqA6 },
  { id: 7, question: SETTINGS_PAGE_I18N.faqQ7, answer: SETTINGS_PAGE_I18N.faqA7 }
]
