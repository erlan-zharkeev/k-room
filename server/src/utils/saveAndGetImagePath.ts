import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import { getPathToImg } from './getPathToImg'
import constants from '../constants'
import { getRequestStringToImg } from './getRequestStringToImg'
import { SharpKey } from '../types/Constants'

export const saveAndGetImagePath = async (
  buffer: ArrayBuffer | undefined,
  type = SharpKey.commonCompressed
): Promise<string> => {
  if (!buffer) return ''
  const newFileName = `${uuidv4()}.jpg`
  const { dimensions, quality } = constants.sharp[`${type}`]
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
