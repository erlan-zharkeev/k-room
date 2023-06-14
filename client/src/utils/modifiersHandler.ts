const modifiersHandler = ({
  rootClass,
  modifiers
}: {
  rootClass: string
  modifiers: Array<string | boolean | undefined>
}): string => {
  const filteredModifiers = modifiers.filter((modifier) => modifier !== undefined)
  const result = filteredModifiers.map((modifier) => modifier && `${rootClass}--${modifier}`)
  result.unshift(rootClass)
  return result.join(' ')
}

export default modifiersHandler
