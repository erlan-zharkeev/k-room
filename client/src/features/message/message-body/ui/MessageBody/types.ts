import { IMessage } from 'common-types'

export interface IMessageBodyProps {
  message: IMessage
}

export interface IMessageBodyReaction {
  authors: UserShortType[]
  glyph: string
}
