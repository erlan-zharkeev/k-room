import { ENV } from '../app/config/constants'

const fs = require('fs')

export const getPathToImg = (filename: string | undefined): string => {
  if (!filename) return ''
  const pathToStaticImage = `${ENV.SERVER_ASSETS_PATH}static/${filename}`
  const isImageStatic = fs.existsSync(pathToStaticImage)
  const result = isImageStatic ? pathToStaticImage : `${ENV.SERVER_ASSETS_PATH}img/${filename}`
  return result
}
