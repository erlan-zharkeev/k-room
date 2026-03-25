import { IMessage } from 'common'

export type MessageListItemType =
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
