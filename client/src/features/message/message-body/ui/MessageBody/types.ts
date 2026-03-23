import type { IBaseFrontendUserData, IMessage } from 'common-types'

export interface IMessageBodyProps {
  message: IMessage
}

export interface IMessageBodyReaction {
  authors: IBaseFrontendUserData[]
  glyph: string
}
