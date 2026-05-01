import { isString } from 'lodash'

export const readFileAsDataUrl = (file: File) =>
  new Promise<string | undefined>((resolve) => {
    const reader = new FileReader()

    reader.addEventListener('load', () => resolve(isString(reader.result) ? reader.result : undefined))
    reader.addEventListener('error', () => resolve(undefined))
    reader.readAsDataURL(file)
  })
