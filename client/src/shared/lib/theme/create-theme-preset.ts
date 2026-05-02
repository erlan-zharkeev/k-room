import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

import { IColorSchema } from '../../config'

import { createPrimaryPalette } from './create-primary-palette'
import { createSurfacePalette } from './create-surface-palette'
import { duplicateThemeModeValue } from './duplicate-theme-mode-value'

export const createThemePreset = (colors: IColorSchema) => {
  const { widgetBg, mainBg, contrastText, secondaryText, text: mutedText, accent, lightShadow, darkShadow } = colors
  const borderColor = `color-mix(in srgb, ${widgetBg}, ${mainBg} 32%)`
  const hoverBackground = `color-mix(in srgb, ${widgetBg}, ${mainBg} 12%)`
  const mutedBackground = `color-mix(in srgb, ${widgetBg}, ${mainBg} 20%)`
  const disabledBackground = `color-mix(in srgb, ${widgetBg}, ${mainBg} 16%)`

  const text = {
    color: contrastText,
    hoverColor: contrastText,
    mutedColor: secondaryText,
    hoverMutedColor: mutedText
  }

  const content = {
    background: widgetBg,
    hoverBackground,
    borderColor,
    color: contrastText,
    hoverColor: contrastText
  }

  const overlay = {
    select: {
      background: widgetBg,
      borderColor,
      color: contrastText
    },
    popover: {
      background: widgetBg,
      borderColor,
      color: contrastText
    },
    modal: {
      background: widgetBg,
      borderColor,
      color: contrastText
    }
  }

  const formField = {
    background: widgetBg,
    disabledBackground,
    filledBackground: mutedBackground,
    filledHoverBackground: hoverBackground,
    filledFocusBackground: widgetBg,
    borderColor,
    hoverBorderColor: borderColor,
    focusBorderColor: accent,
    color: contrastText,
    disabledColor: secondaryText,
    placeholderColor: mutedText,
    invalidPlaceholderColor: mutedText,
    floatLabelColor: mutedText,
    floatLabelFocusColor: accent,
    floatLabelActiveColor: mutedText,
    floatLabelInvalidColor: mutedText,
    iconColor: secondaryText,
    shadow: 'none'
  }

  return definePreset(Aura, {
    semantic: {
      primary: createPrimaryPalette(accent),
      surface: createSurfacePalette(mainBg),
      colorScheme: duplicateThemeModeValue(() => ({
        text,
        content,
        overlay,
        formField
      })),
      extend: {
        app: {
          text: {
            contrast: contrastText,
            semiContrast: secondaryText,
            muted: mutedText
          },
          mainBg,
          mutedBackground,
          widgetBackground: widgetBg,
          shadow: {
            outset: {
              start: lightShadow,
              end: darkShadow
            }
          }
        }
      }
    }
  })
}
