import { IBaseFrontendUserData, IMessage } from 'common'

export interface MessageBodyProps {
  message: IMessage
}

export interface MessageBodyReaction {
  authors: IBaseFrontendUserData[]
  glyph: string
}
