import { defineI18n } from 'common'

export const TECH_SUPPORT_LINK_I18N = defineI18n({
  link: {
    en: (email: string) => `Support: ${email}`,
    ru: (email: string) => `Поддержка: ${email}`
  }
})
