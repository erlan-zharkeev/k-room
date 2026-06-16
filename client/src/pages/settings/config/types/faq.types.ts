import type { LocalizedText } from 'global-shared'

export type FaqDynamicText = (appName: string) => string
export type FaqTextValue = string | FaqDynamicText
export type FaqText = LocalizedText<FaqTextValue>

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
