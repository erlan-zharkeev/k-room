import { IMessage } from 'common-types'

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
