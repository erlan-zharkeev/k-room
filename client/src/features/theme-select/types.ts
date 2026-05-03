import type { Component } from 'vue'

import type { ThemeType } from 'src/shared/config'

export interface IThemeSelectOption {
  icon: Component
  label: {
    en: string
    ru: string
    zh: string
  }
  value: ThemeType
}
