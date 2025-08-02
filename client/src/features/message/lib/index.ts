import { IMessage } from 'common-types'

export const isAutoMessage = (message: IMessage) => message.authorName === 'system' || message.authorName === 'time'
