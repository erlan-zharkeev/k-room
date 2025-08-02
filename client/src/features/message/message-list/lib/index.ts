export const locationModifier = (author: string, selfId: string): string => {
  if (author === 'system' || author === 'time') return author
  else return author === selfId ? 'self' : 'interlocutor'
}
