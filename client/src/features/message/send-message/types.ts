import { IImageObject, IRepliedMessage } from 'common'

export interface ISendMessagePayload {
  authorId: string
  messageText: string
  roomId: string
  username: string
  images?: IImageObject[]
  imageCompression?: boolean
  repliedMessage?: IRepliedMessage | null
}
