import { ImageObject } from 'common-types'

export interface InputMessageProps {
  sendMessage: (message: string) => void
  uploadImageHandler: (payload: { message: string; images: Array<ImageObject> }) => void
  height: number
}
