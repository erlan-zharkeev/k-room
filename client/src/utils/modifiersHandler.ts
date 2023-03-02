export const modifiersHandler = ({ rootClass, modifiers }: { rootClass: string; modifiers: Array<string> }): string => {
  const result = modifiers.map((modifier) => modifier && `${rootClass}--${modifier}`)
  result.unshift(rootClass)
  return result.join(' ')
}

export default modifiersHandler
