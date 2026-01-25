export const locationModifier = (author: string, id: string): string => {
  if (author === 'system' || author === 'time') return author
  else return author === id ? 'self' : 'interlocutor'
}
