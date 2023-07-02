import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import { getPathToImg } from './getPathToImg'
import constants from '../constants'
import { getRequestStringToImg } from './getRequestStringToImg'
import { SharpSettingsKey } from '../types/Constants'
import { throwErrorViaSocket } from './throwErrorViaSocket'

export const saveImageAndGetPath = async (
  buffer: ArrayBuffer | undefined,
  type = SharpSettingsKey['common-compressed'],
  authorId: string
): Promise<string> => {
  if (!buffer) return ''
  const newFileName = `${uuidv4()}.jpg`
  const { dimensions, quality } = constants.sharp[`${type}`]
  const pathToSave = getPathToImg(newFileName)
  try {
    await sharp(buffer)
      .resize(dimensions.x, dimensions.y)
      .jpeg({
        quality
      })
      .toFile(`${pathToSave}`)
  } catch {
    await throwErrorViaSocket(authorId)
    return ''
  }

  return buffer ? getRequestStringToImg(newFileName) : ''
}

export default saveImageAndGetPath
