import type { Buffer } from 'node:buffer'

import sharp from "sharp"

import { SHARP_PRESETS } from 'entities/media/config'

import { SharpSettingsKey } from "shared-config"

export const processImageWithSharp = async (
  input: Buffer,
  presetKey: SharpSettingsKey
): Promise<Buffer> => {

  const preset = SHARP_PRESETS[presetKey] ?? SHARP_PRESETS['common-compressed']
  const image = sharp(input, { failOn: 'none' }).rotate().toFormat('webp', { quality: preset.quality }) // auto-orient по EXIF

  const { width, height } = preset.dimensions
  if (width || height) {
    image.resize(width, height, { fit: 'inside', withoutEnlargement: true, fastShrinkOnLoad: true })
  }

  return image.toBuffer()
}