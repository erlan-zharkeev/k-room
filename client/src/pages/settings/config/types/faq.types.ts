import type { LocalizedText } from 'global-shared'

export interface FaqItem {
  id: number
  question: LocalizedText<string>
  answer: LocalizedText<string>
}
