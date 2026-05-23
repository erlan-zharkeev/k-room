import type { Message } from '../types'

export const isMessageAuthor = (message: Pick<Message, 'authorId'>, userId: string) => message.authorId === userId
