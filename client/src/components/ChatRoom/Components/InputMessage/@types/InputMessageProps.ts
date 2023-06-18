import { ImageObject } from 'src/components/UI/UIFileLoader/@types'

export interface InputMessageProps {
  sendMessage: (message: string) => void
  uploadFileHandler: (payload: { message: string; files: Array<ImageObject> }) => void
  height: number
}
