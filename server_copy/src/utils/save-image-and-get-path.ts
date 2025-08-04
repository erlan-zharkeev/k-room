import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import { getPathToImg } from './get-path-to-img'
import { getRequestStringToImg } from './get-request-string-to-img'
import { SharpSettingsKey } from 'shared/types'
import { clc } from './clc'
import { SYSTEM_DATA } from '../app/config'

export const saveImageAndGetPath = async (
  buffer: ArrayBuffer | undefined | Buffer,
  type: SharpSettingsKey = 'common-uncompressed'
): Promise<string | null> => {
  if (!buffer) return ''
  const newFileName = `${uuidv4()}.jpg`
  const { dimensions, quality } = SYSTEM_DATA.sharp[`${type}`]
  const pathToSave = getPathToImg(newFileName)
  try {
    await sharp(buffer)
      .resize(dimensions.x, dimensions.y)
      .jpeg({
        quality
      })
      .toFile(`${pathToSave}`)
  } catch (e: unknown) {
    console.log(clc.red.bgWhite(e))
  }

  return buffer ? getRequestStringToImg(newFileName) : null
}
