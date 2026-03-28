import type { Buffer } from 'node:buffer'

import sharp from 'sharp'

import { SHARP_PRESETS } from 'src/entities/media/config'

import { SharpSettingsKeyType } from 'src/shared/config'

export const processImageWithSharp = async (input: Buffer, presetKey: SharpSettingsKeyType): Promise<Buffer> => {
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
