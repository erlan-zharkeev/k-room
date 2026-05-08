import type { IFormFieldValidationState } from './types'

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

export const isFormFieldInvalid = (field?: IFormFieldValidationState) =>
  Boolean(field?.invalid && (field.dirty || field.touched))
