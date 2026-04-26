import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

import { ICustomThemeSetting } from '../../types/theme'

import { createPrimaryPalette } from './create-primary-palette'
import { createSurfacePalette } from './create-surface-palette'

export const createThemePreset = (colors: ICustomThemeSetting) =>
  definePreset(Aura, {
    semantic: {
      primary: createPrimaryPalette(colors.accent),
      surface: createSurfacePalette(colors.mainBg),
      focusRing: {
        color: colors.accent
      },
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
          error: '#bf566e',
          shadow: {
            outset: {
              start: colors.shadowOutsetStart,
              end: colors.shadowOutsetEnd
            }
          }
        }
      }
    }
  })
