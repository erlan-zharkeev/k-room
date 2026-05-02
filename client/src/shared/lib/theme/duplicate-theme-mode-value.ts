export const duplicateThemeModeValue = <Value>(createValue: () => Value) => {
  // PrimeVue expects both modes even when the app uses one runtime palette.
  return {
    light: createValue(),
    dark: createValue()
  }
}
