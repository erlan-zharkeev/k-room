import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import { getPathToImg } from './getPathToImg'
import constants from '../constants'
import { getRequestStringToImg } from './getRequestStringToImg'

export const saveAndGetImagePath = async (file: Express.Multer.File | undefined): Promise<string> => {
  const buffer = file?.buffer
  const newFileName = `${uuidv4()}.jpg`
  const { dimensions, quality } = constants.sharp.avatar
  const pathToSave = getPathToImg(newFileName)

  if (buffer) {
    await sharp(buffer)
      .resize(dimensions.x, dimensions.y)
      .jpeg({
        quality
      })
      .toFile(`${pathToSave}`)
  }

  return buffer ? getRequestStringToImg(newFileName) : ''
}

export default saveAndGetImagePath
