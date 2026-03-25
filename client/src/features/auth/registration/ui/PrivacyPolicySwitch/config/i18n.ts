import { type LocalizedTextType } from 'common-types'

export const PRIVACY_POLICY_SWITCH_TEXT = {
  agreement: {
    en: 'I have read and agree',
    ru: 'Я прочитал и принимаю'
  },
  link: {
    en: 'legal information',
    ru: 'правовую информацию'
  }
} as const satisfies Record<string, LocalizedTextType>
