import { IImageObject, IChatRoom } from 'common-types'

export interface IMessageInputData {
  body: string
  images: IImageObject[]
  imageCompression: boolean
}

export interface IAppChatRoom extends IChatRoom {
  lastScrolledMessageId?: string
}

export interface IRoomState {
  chatRooms: IAppChatRoom[]
}
