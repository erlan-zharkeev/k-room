import type { ThemeType } from 'src/shared/config'

import type { Component } from 'vue'

export interface IThemeSelectOption {
  icon: Component
  label: {
    en: string
    ru: string
    zh: string
  }
  value: ThemeType
}
