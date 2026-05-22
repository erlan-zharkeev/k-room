import type { Component } from 'vue'

import type { Theme } from 'src/entities/setting'

export interface ThemeSelectOption {
  icon: Component | string
  label: {
    en: string
    ru: string
    zh: string
  }
  value: Theme
}
