export type MediaUrlCacheValue = {
  cancelRelease?: () => void
  refs: number
  url: string
}

export type MediaUrlCacheKeyParams = {
  mediaId: string
  etag?: string
  lastModified?: string
  lastChecked: number
}

export type MediaDeviceSelectModelValue = string | string[] | null | undefined

export interface MediaDeviceSelectOption {
  label: string
  value: string
}

export interface BuildMediaDeviceSelectOptionsParams {
  devices: MediaDeviceInfo[]
  emptyValue?: string
  defaultOptionLabel?: string
  unknownOptionLabel: string
  unknownOptionLabelWithIndex?: boolean
}
