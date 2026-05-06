import { NmorphIconMoon, NmorphIconSunny } from '@nmorph/nmorph-ui-kit'

import { SETTINGS_PAGE_APPEARANCE_I18N } from '../i18n/appearance.i18n'

export const CUSTOM_THEME_RESET_OPTIONS = [
  {
    icon: NmorphIconSunny,
    label: SETTINGS_PAGE_APPEARANCE_I18N.lightTheme,
    value: 'light'
  },
  {
    icon: NmorphIconMoon,
    label: SETTINGS_PAGE_APPEARANCE_I18N.darkTheme,
    value: 'dark'
  }
] as const

export const CUSTOM_THEME_COLOR_GROUPS = [
  {
    id: 'base',
    items: [
      {
        id: 'main',
        label: SETTINGS_PAGE_APPEARANCE_I18N.main
      },
      {
        id: 'accent',
        label: SETTINGS_PAGE_APPEARANCE_I18N.accent
      }
    ]
  },
  {
    id: 'text',
    items: [
      {
        id: 'text',
        label: SETTINGS_PAGE_APPEARANCE_I18N.text
      },
      {
        id: 'focusText',
        label: SETTINGS_PAGE_APPEARANCE_I18N.focusText
      },
      {
        id: 'contrastText',
        label: SETTINGS_PAGE_APPEARANCE_I18N.contrastText
      },
      {
        id: 'placeholderText',
        label: SETTINGS_PAGE_APPEARANCE_I18N.placeholderText
      },
      {
        id: 'semiContrastText',
        label: SETTINGS_PAGE_APPEARANCE_I18N.semiContrastText
      }
    ]
  },
  {
    id: 'service',
    items: [
      {
        id: 'info',
        label: SETTINGS_PAGE_APPEARANCE_I18N.info
      },
      {
        id: 'infoText',
        label: SETTINGS_PAGE_APPEARANCE_I18N.infoText
      },
      {
        id: 'success',
        label: SETTINGS_PAGE_APPEARANCE_I18N.success
      },
      {
        id: 'successText',
        label: SETTINGS_PAGE_APPEARANCE_I18N.successText
      },
      {
        id: 'error',
        label: SETTINGS_PAGE_APPEARANCE_I18N.error
      },
      {
        id: 'errorText',
        label: SETTINGS_PAGE_APPEARANCE_I18N.errorText
      },
      {
        id: 'warn',
        label: SETTINGS_PAGE_APPEARANCE_I18N.warn
      },
      {
        id: 'warnText',
        label: SETTINGS_PAGE_APPEARANCE_I18N.warnText
      }
    ]
  },
  {
    id: 'overlay',
    items: [
      {
        id: 'overlay',
        label: SETTINGS_PAGE_APPEARANCE_I18N.overlay
      },
      {
        id: 'scrollThumb',
        label: SETTINGS_PAGE_APPEARANCE_I18N.scrollThumb
      }
    ]
  }
] as const

export const CUSTOM_THEME_SHADOW_ITEMS = [
  {
    id: 'darkShadeGeneratorCoefficient',
    label: SETTINGS_PAGE_APPEARANCE_I18N.darkShadeGeneratorCoefficient,
    min: -80,
    max: -5,
    step: 1,
    unit: ''
  },
  {
    id: 'lightShadeGeneratorCoefficient',
    label: SETTINGS_PAGE_APPEARANCE_I18N.lightShadeGeneratorCoefficient,
    min: 5,
    max: 80,
    step: 1,
    unit: ''
  },
  {
    id: 'baseShadowWidth',
    label: SETTINGS_PAGE_APPEARANCE_I18N.baseShadowWidth,
    min: 1,
    max: 8,
    step: 0.5,
    unit: 'px'
  },
  {
    id: 'baseShadowBlurCoefficient',
    label: SETTINGS_PAGE_APPEARANCE_I18N.baseShadowBlurCoefficient,
    min: 1,
    max: 4,
    step: 0.25,
    unit: ''
  }
] as const
