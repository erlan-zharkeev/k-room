export interface SharpConfig {
  quality: number
  dimensions: {
    x: number | null
    y: number | null
  }
}

export type SharpSettingsKeyType = 'avatar' | 'common-compressed' | 'common-uncompressed'
