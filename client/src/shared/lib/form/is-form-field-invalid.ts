import type { IFormFieldValidationState } from './types'

export const isFormFieldInvalid = (field?: IFormFieldValidationState) =>
  Boolean(field?.invalid && (field.dirty || field.touched))
