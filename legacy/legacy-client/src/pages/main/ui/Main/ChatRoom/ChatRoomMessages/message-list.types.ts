import { IMessage } from 'common'

export type MessageListItem =
  | {
      type: 'message'
      id: string
      message: IMessage
    }
  | {
      type: 'date-separator'
      id: string
      label: string
    }
