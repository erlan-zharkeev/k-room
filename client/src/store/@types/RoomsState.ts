import { ChatRoom, Message } from 'common-types'

export interface AttachedFilesMessage {
  body: string
  files: Array<any>
  filesCompression: boolean
}

export interface RoomsState {
  chatRooms: Array<ChatRoom>
  repliedMessageData: Message
  attachedFilesMessage: AttachedFilesMessage
}
