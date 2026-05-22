import { IBaseFrontendUserData, IMessage } from 'common'

export interface MessageBodyReaction {
  authors: IBaseFrontendUserData[]
  glyph: string
}

export interface MessageReactionsProps {
  message: IMessage
}
