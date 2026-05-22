import type { INmorphThemeInstance } from '@nmorph/nmorph-ui-kit'

import type { FormFieldValidationState } from './types'

export const buildPathWithParams = <T extends object>(basePath: string, params: T) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value))
    }
  })

  return `${basePath}?${searchParams.toString()}`
}

export const firstCharUpperCase = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)

export const getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min

export const isFormFieldInvalid = (field?: FormFieldValidationState) =>
  Boolean(field?.invalid && (field.dirty || field.touched))

export const getNmorphGeneratedColorSchema = (
  mainColor: string,
  getDynamicColorVariables: INmorphThemeInstance['getDynamicColorVariables']
) => {
  const variables = getDynamicColorVariables(mainColor) ?? []
  const darkShade = variables.find(({ name }) => name === '--nmorph-dark-shade-color')?.color
  const lightShade = variables.find(({ name }) => name === '--nmorph-light-shade-color')?.color

  return darkShade && lightShade ? { darkShade, lightShade } : {}
}
