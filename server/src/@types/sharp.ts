export interface SharpConfig {
  quality: number
  dimensions: {
    x: number | null
    y: number | null
  }
}

export type SharpSettingsKey = 'avatar' | 'common-compressed' | 'common-uncompressed'
