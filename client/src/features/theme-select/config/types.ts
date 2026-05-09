import type { Component } from 'vue'

import type { ThemeType } from 'src/entities/setting'

export interface IThemeSelectOption {
  icon: Component | string
  label: {
    en: string
    ru: string
    zh: string
  }
  value: ThemeType
}
