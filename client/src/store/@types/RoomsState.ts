import { ChatRoom, Message } from 'common-types'

export interface AttachedFilesMessage {
  body: string
  images: Array<any>
  imageCompression: boolean
}

export interface RoomsState {
  loading: boolean
  chatRooms: Array<ChatRoom>
  repliedMessageData: Message
  attachedFilesMessage: AttachedFilesMessage
}
