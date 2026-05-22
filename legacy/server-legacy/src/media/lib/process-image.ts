import { Buffer } from 'node:buffer'

import sharp from 'sharp'

import { SharpSettingsKey } from 'src/shared/config'

import { SHARP_PRESETS } from '../config/constants'

export const processImageWithSharp = async (input: Buffer, presetKey: SharpSettingsKey): Promise<Buffer> => {
  const preset = SHARP_PRESETS[presetKey] ?? SHARP_PRESETS['common-compressed']

  const image = sharp(input, { failOn: 'none' })
    .rotate()
    .resize({
      width: preset.dimensions.width ?? undefined,
      height: preset.dimensions.height ?? undefined,
      fit: 'inside',
      withoutEnlargement: true,
      fastShrinkOnLoad: true
    })
    .toFormat('webp', { quality: preset.quality })

  return image.toBuffer()
}
