import { type Buffer } from 'node:buffer'

import sharp from 'sharp'

import { SHARP_PRESETS } from '../media.constants'
import type { UploadOptions } from '../media.types'

export const processImageWithSharp = async (input: Buffer, presetKey: UploadOptions['compression']) => {
  const preset = SHARP_PRESETS[presetKey ?? 'common-compressed']

  return sharp(input, { failOn: 'none' })
    .rotate()
    .resize({
      width: preset.dimensions.width ?? undefined,
      height: preset.dimensions.height ?? undefined,
      withoutEnlargement: true,
      fastShrinkOnLoad: true
    })
    .toFormat('webp', { quality: preset.quality })
    .toBuffer()
}
