import ENV from '../ENV'
const fs = require('fs')

export const getPathToImg = (filename: string | undefined): string => {
  if (!filename) return ''
  const pathToStaticImage = `${ENV.SERVER_ASSETS_PATH}static/${filename}`
  const isImageStatic = fs.existsSync(pathToStaticImage)
  return isImageStatic ? pathToStaticImage : `${ENV.SERVER_ASSETS_PATH}img/${filename}`
}
