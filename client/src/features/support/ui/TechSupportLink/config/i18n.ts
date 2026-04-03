import { LocalizedTextMapType } from 'common'

export const TECH_SUPPORT_LINK_I18N = {
  link: {
    en: (email: string) => `Support: ${email}`,
    ru: (email: string) => `Поддержка: ${email}`
  }
} as const satisfies LocalizedTextMapType<any>
