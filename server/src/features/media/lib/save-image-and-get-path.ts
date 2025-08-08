import { type SharpSettingsKey, SYSTEM_DATA } from 'shared-config'
import { log } from 'shared-lib'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

import { getPathToImg } from './get-path-to-img'
import { getRequestStringToImg } from './get-request-string-to-img'

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
    log.error(String(e))
  }

  return buffer ? getRequestStringToImg(newFileName) : null
}
