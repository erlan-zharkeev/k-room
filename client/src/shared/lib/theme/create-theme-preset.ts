import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

import { IColorSchema } from '../../config'

import { createPrimaryPalette } from './create-primary-palette'
import { createSurfacePalette } from './create-surface-palette'

export const createThemePreset = (colors: IColorSchema) => {
  const borderColor = `color-mix(in srgb, ${colors.widgetBg}, ${colors.mainBg} 32%)`
  const hoverBackground = `color-mix(in srgb, ${colors.widgetBg}, ${colors.mainBg} 12%)`
  const mutedBackground = `color-mix(in srgb, ${colors.widgetBg}, ${colors.mainBg} 20%)`
  const disabledBackground = `color-mix(in srgb, ${colors.widgetBg}, ${colors.mainBg} 16%)`
  const textColorScheme = {
    color: colors.contrastText,
    hoverColor: colors.contrastText,
    mutedColor: colors.secondaryText,
    hoverMutedColor: colors.text
  }
  const contentColorScheme = {
    background: colors.widgetBg,
    hoverBackground,
    borderColor,
    color: colors.contrastText,
    hoverColor: colors.contrastText
  }
  const overlayColorScheme = {
    select: {
      background: colors.widgetBg,
      borderColor,
      color: colors.contrastText
    },
    popover: {
      background: colors.widgetBg,
      borderColor,
      color: colors.contrastText
    },
    modal: {
      background: colors.widgetBg,
      borderColor,
      color: colors.contrastText
    }
  }
  const formFieldColorScheme = {
    background: colors.widgetBg,
    disabledBackground,
    filledBackground: mutedBackground,
    filledHoverBackground: hoverBackground,
    filledFocusBackground: colors.widgetBg,
    borderColor,
    hoverBorderColor: borderColor,
    focusBorderColor: colors.accent,
    color: colors.contrastText,
    disabledColor: colors.secondaryText,
    placeholderColor: colors.text,
    invalidPlaceholderColor: colors.text,
    floatLabelColor: colors.text,
    floatLabelFocusColor: colors.accent,
    floatLabelActiveColor: colors.text,
    floatLabelInvalidColor: colors.text,
    iconColor: colors.secondaryText,
    shadow: 'none'
  }

  return definePreset(Aura, {
    semantic: {
      primary: createPrimaryPalette(colors.accent),
      surface: createSurfacePalette(colors.mainBg),
      colorScheme: {
        light: {
          text: { ...textColorScheme },
          content: { ...contentColorScheme },
          overlay: { ...overlayColorScheme },
          formField: { ...formFieldColorScheme }
        },
        dark: {
          text: { ...textColorScheme },
          content: { ...contentColorScheme },
          overlay: { ...overlayColorScheme },
          formField: { ...formFieldColorScheme }
        }
      },
      extend: {
        app: {
          text: {
            contrast: colors.contrastText,
            semiContrast: colors.secondaryText,
            muted: colors.text
          },
          mainBg: colors.mainBg,
          mutedBackground,
          widgetBackground: colors.widgetBg,
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
                hoverBorderColor: 'transparent',
                borderColor: 'transparent',
                activeBorderColor: 'transparent'
              }
            }
          },
          dark: {
            root: {
              secondary: {
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
}
