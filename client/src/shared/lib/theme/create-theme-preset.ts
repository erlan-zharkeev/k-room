import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

import { IColorSchema } from '../../config'

import { createPrimaryPalette } from './create-primary-palette'
import { createSurfacePalette } from './create-surface-palette'

export const createThemePreset = (colors: IColorSchema) =>
  definePreset(Aura, {
    semantic: {
      primary: createPrimaryPalette(colors.accent),
      surface: createSurfacePalette(colors.mainBg),
      extend: {
        app: {
          text: {
            contrast: colors.contrastText,
            semiContrast: colors.secondaryText,
            muted: colors.text
          },
          mainBg: colors.mainBg,
          // mutedBackground: colors.darkGrayTransparent,
          widgetBackground: colors.cardSurface,
          // widgetBorderColor: colors.darkGrayTransparent,
          shadow: {
            outset: {
              start: colors.lightShadow,
              end: colors.darkShadow
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
                // background: colors.buttonSecondaryBackground,
                // hoverBackground: colors.buttonSecondaryHoverBackground,
                hoverBorderColor: 'transparent',
                borderColor: 'transparent',
                activeBorderColor: 'transparent'
              }
            }
          },
          dark: {
            root: {
              secondary: {
                // background: colors.buttonSecondaryBackground,
                // hoverBackground: colors.buttonSecondaryHoverBackground,
                hoverBorderColor: 'transparent',
                borderColor: 'transparent',
                activeBorderColor: 'transparent'
              }
            }
          }
        }
      }
    }
  })
