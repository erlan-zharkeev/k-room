import type { IBaseFrontendUserData, IMessage } from 'common'

export interface IMessageBodyProps {
  message: IMessage
}

export interface IMessageBodyReaction {
  authors: IBaseFrontendUserData[]
  glyph: string
}
