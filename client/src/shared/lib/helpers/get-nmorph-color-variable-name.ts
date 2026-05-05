export const getNmorphColorVariableName = (key: string) => {
  return `--nmorph-${key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}-color`
}
