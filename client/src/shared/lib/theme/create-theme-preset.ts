import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

import type { ICustomThemeSetting } from 'src/shared/types/theme'

import { createPrimaryPalette } from './create-primary-palette'
import { createSurfacePalette } from './create-surface-palette'

export const createThemePreset = (colors: ICustomThemeSetting) =>
  definePreset(Aura, {
    semantic: {
      primary: createPrimaryPalette(colors.accent),
      surface: createSurfacePalette(colors.mainBg),
      extend: {
        app: {
          text: {
            contrast: colors.text.contrastText,
            semiContrast: colors.text.semiContrastText,
            muted: colors.text.text
          },
          mainBg: colors.mainBg,
          mutedBackground: colors.darkGrayTransparent,
          widgetBackground: colors.surfaceCard,
          widgetBorderColor: colors.darkGrayTransparent,
          shadow: {
            outset: {
              start: colors.shadowOutsetStart,
              end: colors.shadowOutsetEnd
            }
          }
        }
      }
    },
    components: {
      button: {
        colorScheme: {
          light: {
            root: {
              secondary: {
                background: colors.buttonSecondaryBackground,
                hoverBackground: colors.buttonSecondaryHoverBackground,
                hoverBorderColor: 'transparent',
                borderColor: 'transparent'
              }
            },
            text: {
              primary: {
                hoverBackground: 'transparent'
              }
            }
          },
          dark: {
            root: {
              secondary: {
                background: colors.buttonSecondaryBackground,
                hoverBackground: colors.buttonSecondaryHoverBackground,
                hoverBorderColor: 'transparent',
                borderColor: 'transparent'
              }
            },
            text: {
              primary: {
                hoverBackground: 'transparent'
              }
            }
          }
        }
      }
    }
  })
