export const modifiersHandler = ({
  rootClass,
  modifiers
}: {
  rootClass: string
  modifiers: Array<string | boolean | undefined>
}): string => {
  const filteredModifiers = modifiers.filter((modifier) => modifier) as string[];
  const result = filteredModifiers.map((modifier) => `${rootClass}--${modifier}`);
  result.unshift(rootClass);
  return result.filter(Boolean).join(' ');
};
