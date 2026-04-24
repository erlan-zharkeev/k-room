import type { ICreateClassNameWithModifiersParams } from './types'

export const createClassNameWithModifiers = ({
  rootClass,
  modifiers,
  additionalClassName
}: ICreateClassNameWithModifiersParams): string => {
  const filteredModifiers = modifiers.filter((modifier) => modifier !== undefined && modifier !== false) as string[]
  const result = filteredModifiers.map((modifier) => `${rootClass}--${modifier}`)

  result.unshift(rootClass)
  if (additionalClassName) result.push(additionalClassName)

  return result.filter(Boolean).join(' ')
}
