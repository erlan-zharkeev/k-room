import { ImageObject } from 'common-types'

export interface InputMessageProps {
  sendMessage: (message: string) => void
  uploadFileHandler: (payload: { message: string; files: Array<ImageObject> }) => void
  height: number
}
