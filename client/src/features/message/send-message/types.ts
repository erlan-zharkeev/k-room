import { IImageObject, IRepliedMessage } from 'common-types'

export interface ISendMessagePayload {
  authorId: string
  messageText: string
  roomId: string
  username: string
  images?: IImageObject[]
  imageCompression?: boolean
  repliedMessage?: IRepliedMessage | null
}
