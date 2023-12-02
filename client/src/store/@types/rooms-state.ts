import { ChatRoom, ImageObject, RepliedMessage } from 'common-types'

export interface AttachedFilesMessage {
  body: string
  images: Array<ImageObject>
  imageCompression: boolean
}

export interface RoomsState {
  isLoading: boolean
  chatRooms: Array<ChatRoom>
  repliedMessageData: RepliedMessage
  attachedFilesMessage: AttachedFilesMessage
}
