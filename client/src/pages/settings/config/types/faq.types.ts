import type { I18nKey } from 'src/shared/lib'

export type FaqText = I18nKey

export interface FaqItem {
  id: number
  question: FaqText
  answer: FaqText
}

export interface ResolvedFaqItem {
  id: number
  question: string
  answer: string
}
