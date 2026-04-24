import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

export const primeVueTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#edf5fd',
      100: '#d9eafd',
      200: '#b7d5fa',
      300: '#8fc0f4',
      400: '#67aaec',
      500: '#418fde',
      600: '#3271ba',
      700: '#285995',
      800: '#234a78',
      900: '#1e3e64',
      950: '#132641'
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f4f4f4',
          100: '#e8e8e8',
          200: '#d6d6d6',
          300: '#cfcfcf',
          400: '#bdbdbd',
          500: '#949494',
          600: '#747474',
          700: '#5e5e5e',
          800: '#4a4a4a',
          900: '#2f2f2f',
          950: '#141414'
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}'
        },
        highlight: {
          background: 'color-mix(in srgb, {primary.500}, transparent 88%)',
          focusBackground: 'color-mix(in srgb, {primary.500}, transparent 82%)',
          color: '{primary.800}',
          focusColor: '{primary.900}'
        },
        text: {
          color: '#000000',
          hoverColor: '#000000',
          mutedColor: 'rgb(74 74 74 / 79.7%)',
          hoverMutedColor: '#2f2f2f'
        },
        content: {
          background: 'rgb(255 255 255 / 72%)',
          hoverBackground: 'rgb(255 255 255 / 88%)',
          borderColor: 'rgb(189 189 189 / 50%)',
          color: '#000000',
          hoverColor: '#000000'
        },
        formField: {
          background: 'rgb(255 255 255 / 76%)',
          disabledBackground: '#e8e8e8',
          filledBackground: 'rgb(255 255 255 / 84%)',
          filledHoverBackground: 'rgb(255 255 255 / 90%)',
          filledFocusBackground: '#ffffff',
          borderColor: 'rgb(189 189 189 / 60%)',
          hoverBorderColor: '#418fde',
          focusBorderColor: '#418fde',
          invalidBorderColor: 'rgb(191 86 110)',
          color: '#000000',
          disabledColor: '#747474',
          placeholderColor: 'rgb(94 94 94 / 84.7%)',
          invalidPlaceholderColor: 'rgb(191 86 110)',
          floatLabelColor: 'rgb(94 94 94 / 84.7%)',
          floatLabelFocusColor: '#418fde',
          floatLabelActiveColor: 'rgb(94 94 94 / 84.7%)',
          iconColor: '#747474',
          shadow: 'none'
        },
        overlay: {
          select: {
            background: '#f4f4f4',
            borderColor: 'rgb(189 189 189 / 60%)',
            color: '#000000'
          },
          popover: {
            background: '#ffffff',
            borderColor: 'rgb(189 189 189 / 60%)',
            color: '#000000'
          },
          modal: {
            background: '#ffffff',
            borderColor: 'rgb(189 189 189 / 60%)',
            color: '#000000'
          }
        }
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '#f5f5f5',
          100: '#d6d6d6',
          200: '#bdbdbd',
          300: '#a2a2a2',
          400: '#848484',
          500: '#676767',
          600: '#4b4b4b',
          700: '#3b3b3b',
          800: '#292929',
          900: '#1c1c1c',
          950: '#0f0f0f'
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.400}',
          activeColor: '{primary.300}'
        },
        highlight: {
          background: 'color-mix(in srgb, {primary.500}, transparent 84%)',
          focusBackground: 'color-mix(in srgb, {primary.500}, transparent 76%)',
          color: '#ffffff',
          focusColor: '#ffffff'
        },
        text: {
          color: '#ffffff',
          hoverColor: '#ffffff',
          mutedColor: 'rgb(255 255 255 / 79.7%)',
          hoverMutedColor: '#ffffff'
        },
        content: {
          background: 'rgb(28 28 28 / 88%)',
          hoverBackground: '#292929',
          borderColor: 'rgb(59 59 59 / 40%)',
          color: '#ffffff',
          hoverColor: '#ffffff'
        },
        formField: {
          background: 'rgb(28 28 28 / 92%)',
          disabledBackground: '#292929',
          filledBackground: '#202020',
          filledHoverBackground: '#202020',
          filledFocusBackground: '#202020',
          borderColor: '#3b3b3b',
          hoverBorderColor: '#418fde',
          focusBorderColor: '#418fde',
          invalidBorderColor: 'rgb(191 86 110)',
          color: '#ffffff',
          disabledColor: '#a2a2a2',
          placeholderColor: 'rgb(177 177 177 / 60%)',
          invalidPlaceholderColor: 'rgb(191 86 110)',
          floatLabelColor: 'rgb(177 177 177 / 60%)',
          floatLabelFocusColor: '#418fde',
          floatLabelActiveColor: 'rgb(177 177 177 / 60%)',
          iconColor: '#a2a2a2',
          shadow: 'none'
        },
        overlay: {
          select: {
            background: '#1c1c1c',
            borderColor: '#3b3b3b',
            color: '#ffffff'
          },
          popover: {
            background: '#1c1c1c',
            borderColor: '#3b3b3b',
            color: '#ffffff'
          },
          modal: {
            background: '#1c1c1c',
            borderColor: '#3b3b3b',
            color: '#ffffff'
          }
        }
      }
    }
  }
})
