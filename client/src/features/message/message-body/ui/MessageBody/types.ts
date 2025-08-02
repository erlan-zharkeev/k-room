import { IMessage, UserShortType } from 'common-types'

export interface IMessageBodyProps {
  message: IMessage
  isPrivate: Boolean
}

export interface IMessageBodyReaction {
  authors: UserShortType[]
  glyph: string
}
