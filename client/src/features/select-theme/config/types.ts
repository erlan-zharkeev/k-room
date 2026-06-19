import type { Component } from 'vue'

import type { Theme } from 'src/entities/setting'
import type { I18nKey } from 'src/shared/lib'

export interface SelectThemeOption {
  icon: Component | string
  label: I18nKey
  value: Theme
}
