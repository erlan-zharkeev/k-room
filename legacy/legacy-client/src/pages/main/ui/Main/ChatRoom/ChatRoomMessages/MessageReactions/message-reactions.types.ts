import { IBaseFrontendUserData, IMessage } from 'common'

export interface IMessageBodyReaction {
  authors: IBaseFrontendUserData[]
  glyph: string
}

export interface IMessageReactionsProps {
  message: IMessage
}
