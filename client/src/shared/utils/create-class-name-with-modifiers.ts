export const createClassNameWithModifiers = ({
  rootClass,
  modifiers,
  additionalClassName
}: {
  rootClass: string
  modifiers: Array<string | boolean | undefined>
  additionalClassName?: string
}): string => {
  const filteredModifiers = modifiers.filter((modifier) => modifier !== undefined && modifier !== false) as string[]
  const result = filteredModifiers.map((modifier) => `${rootClass}--${modifier}`)
  result.unshift(rootClass)
  if (additionalClassName) result.push(additionalClassName)
  return result.filter(Boolean).join(' ')
}
