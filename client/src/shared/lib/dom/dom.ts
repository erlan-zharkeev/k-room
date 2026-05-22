import type { CreateClassNameWithModifiersParams } from './types'
import type { StoppableEvent } from './types'

export const createClassNameWithModifiers = ({
  rootClass,
  modifiers,
  additionalClassName
}: CreateClassNameWithModifiersParams): string => {
  const filteredModifiers = modifiers.filter((modifier) => modifier !== undefined && modifier !== false) as string[]
  const result = filteredModifiers.map((modifier) => `${rootClass}--${modifier}`)

  result.unshift(rootClass)
  if (additionalClassName) result.push(additionalClassName)

  return result.filter(Boolean).join(' ')
}

export const stopPropagation = (evt: StoppableEvent) => {
  const nativeEvent = 'domEvent' in evt ? evt.domEvent : evt

  nativeEvent.stopPropagation()
}
