import { ImageObject } from 'common-types'
export interface UIFileLoaderProps {
  multiple?: boolean
  allowedResolutions?: Array<string>
  setImages: (images: Array<ImageObject>) => void
}
