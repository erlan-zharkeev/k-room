import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import { getPathToImg } from './get-path-to-img'
import { getRequestStringToImg } from './get-request-string-to-img'
import { SharpSettingsKey } from '../@types/Constants'
import { throwErrorViaSocket } from './throw-error-via-socket'
import { serverConstants } from '../server-constants'

export const saveImageAndGetPath = async (
  buffer: ArrayBuffer | undefined | Buffer,
  type = SharpSettingsKey.commonCompressed,
  authorId: string
): Promise<string> => {
  if (!buffer) return ''
  const newFileName = `${uuidv4()}.jpg`
  const { dimensions, quality } = serverConstants.sharp[`${type}`]
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
