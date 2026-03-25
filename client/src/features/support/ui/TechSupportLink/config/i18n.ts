import { type LocalizedTextType } from 'common-types'

export const TECH_SUPPORT_LINK_I18N = {
  link: {
    en: (email: string) => `Support: ${email}`,
    ru: (email: string) => `Поддержка: ${email}`
  }
} as const satisfies Record<string, LocalizedTextType<any>>
