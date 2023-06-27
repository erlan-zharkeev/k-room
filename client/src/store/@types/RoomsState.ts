import { ChatRoom, ImageObject, Message } from 'common-types'

export interface AttachedFilesMessage {
  body: string
  images: Array<ImageObject>
  imageCompression: boolean
}

export interface RoomsState {
  isLoading: boolean
  chatRooms: Array<ChatRoom>
  repliedMessageData: Message
  attachedFilesMessage: AttachedFilesMessage
}
