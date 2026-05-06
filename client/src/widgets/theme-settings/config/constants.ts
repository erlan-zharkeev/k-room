import { NmorphIconMoon, NmorphIconSunny } from '@nmorph/nmorph-ui-kit'

import { THEME_SETTINGS_I18N } from './i18n'

export const THEME_SETTINGS_RESET_THEME_OPTIONS = [
  {
    icon: NmorphIconSunny,
    label: THEME_SETTINGS_I18N.lightTheme,
    value: 'light'
  },
  {
    icon: NmorphIconMoon,
    label: THEME_SETTINGS_I18N.darkTheme,
    value: 'dark'
  }
] as const

export const THEME_SETTINGS_COLOR_GROUPS = [
  {
    id: 'base',
    items: [
      {
        id: 'main',
        label: THEME_SETTINGS_I18N.main
      },
      {
        id: 'accent',
        label: THEME_SETTINGS_I18N.accent
      }
    ]
  },
  {
    id: 'text',
    items: [
      {
        id: 'text',
        label: THEME_SETTINGS_I18N.text
      },
      {
        id: 'focusText',
        label: THEME_SETTINGS_I18N.focusText
      },
      {
        id: 'contrastText',
        label: THEME_SETTINGS_I18N.contrastText
      },
      {
        id: 'placeholderText',
        label: THEME_SETTINGS_I18N.placeholderText
      },
      {
        id: 'semiContrastText',
        label: THEME_SETTINGS_I18N.semiContrastText
      }
    ]
  },
  {
    id: 'service',
    items: [
      {
        id: 'info',
        label: THEME_SETTINGS_I18N.info
      },
      {
        id: 'infoText',
        label: THEME_SETTINGS_I18N.infoText
      },
      {
        id: 'success',
        label: THEME_SETTINGS_I18N.success
      },
      {
        id: 'successText',
        label: THEME_SETTINGS_I18N.successText
      },
      {
        id: 'error',
        label: THEME_SETTINGS_I18N.error
      },
      {
        id: 'errorText',
        label: THEME_SETTINGS_I18N.errorText
      },
      {
        id: 'warn',
        label: THEME_SETTINGS_I18N.warn
      },
      {
        id: 'warnText',
        label: THEME_SETTINGS_I18N.warnText
      }
    ]
  },
  {
    id: 'overlay',
    items: [
      {
        id: 'overlay',
        label: THEME_SETTINGS_I18N.overlay
      },
      {
        id: 'scrollThumb',
        label: THEME_SETTINGS_I18N.scrollThumb
      }
    ]
  }
] as const

export const THEME_SETTINGS_SHADOW_ITEMS = [
  {
    id: 'darkShadeGeneratorCoefficient',
    label: THEME_SETTINGS_I18N.darkShadeGeneratorCoefficient,
    min: -80,
    max: -5,
    step: 1,
    unit: ''
  },
  {
    id: 'lightShadeGeneratorCoefficient',
    label: THEME_SETTINGS_I18N.lightShadeGeneratorCoefficient,
    min: 5,
    max: 80,
    step: 1,
    unit: ''
  },
  {
    id: 'baseShadowWidth',
    label: THEME_SETTINGS_I18N.baseShadowWidth,
    min: 1,
    max: 8,
    step: 0.5,
    unit: 'px'
  },
  {
    id: 'baseShadowBlurCoefficient',
    label: THEME_SETTINGS_I18N.baseShadowBlurCoefficient,
    min: 1,
    max: 4,
    step: 0.25,
    unit: ''
  }
] as const
