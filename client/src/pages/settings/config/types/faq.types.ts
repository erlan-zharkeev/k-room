import type { LocalizedTextType } from 'global-shared'

export interface IFaqItem {
  id: number
  question: LocalizedTextType<string>
  answer: LocalizedTextType<string>
}
