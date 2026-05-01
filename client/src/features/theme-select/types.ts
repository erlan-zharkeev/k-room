import type { ThemeType } from 'src/shared/config'

export interface IThemeSelectOption {
  icon: string
  label: {
    en: string
    ru: string
    zh: string
  }
  value: ThemeType
}
