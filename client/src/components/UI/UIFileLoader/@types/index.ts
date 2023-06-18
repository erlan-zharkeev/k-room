export interface ImageObject {
  name: any
  src: string | ArrayBuffer | null
  file: File
}

export interface UIFileLoaderProps {
  multiple?: boolean
  allowedResolutions?: Array<string>
  setImages: (images: Array<ImageObject>) => void
}
