import { type LocalizedTextMapType } from 'common'

export const PRIVACY_POLICY_SWITCH_I18N = {
  agreement: {
    en: 'I have read and agree',
    ru: 'Я прочитал и принимаю'
  },
  link: {
    en: 'legal information',
    ru: 'правовую информацию'
  }
} as const satisfies LocalizedTextMapType
