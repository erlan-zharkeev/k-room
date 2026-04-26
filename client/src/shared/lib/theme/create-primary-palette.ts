export const createPrimaryPalette = (accent: string) => ({
  50: `color-mix(in srgb, ${accent}, white 92%)`,
  100: `color-mix(in srgb, ${accent}, white 84%)`,
  200: `color-mix(in srgb, ${accent}, white 72%)`,
  300: `color-mix(in srgb, ${accent}, white 56%)`,
  400: `color-mix(in srgb, ${accent}, white 32%)`,
  500: accent,
  600: `color-mix(in srgb, ${accent}, black 12%)`,
  700: `color-mix(in srgb, ${accent}, black 24%)`,
  800: `color-mix(in srgb, ${accent}, black 36%)`,
  900: `color-mix(in srgb, ${accent}, black 48%)`,
  950: `color-mix(in srgb, ${accent}, black 60%)`,
  color: accent,
  contrastColor: '#ffffff',
  hoverColor: `color-mix(in srgb, ${accent}, black 12%)`,
  activeColor: `color-mix(in srgb, ${accent}, black 20%)`
})
