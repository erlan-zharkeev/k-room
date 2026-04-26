export const createSurfacePalette = (mainBg: string) => ({
  0: '#ffffff',
  50: `color-mix(in srgb, ${mainBg}, white 92%)`,
  100: `color-mix(in srgb, ${mainBg}, white 84%)`,
  200: `color-mix(in srgb, ${mainBg}, white 72%)`,
  300: `color-mix(in srgb, ${mainBg}, white 60%)`,
  400: `color-mix(in srgb, ${mainBg}, white 44%)`,
  500: `color-mix(in srgb, ${mainBg}, white 28%)`,
  600: `color-mix(in srgb, ${mainBg}, black 12%)`,
  700: `color-mix(in srgb, ${mainBg}, black 24%)`,
  800: `color-mix(in srgb, ${mainBg}, black 36%)`,
  900: mainBg,
  950: `color-mix(in srgb, ${mainBg}, black 48%)`
})
