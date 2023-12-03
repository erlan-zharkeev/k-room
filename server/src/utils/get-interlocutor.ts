import { KRoomUser } from '../@types'

export const getInterlocutor = (users: Array<KRoomUser>, selfId: string): KRoomUser => {
  const interlocutor = users.filter((user) => user.id !== selfId)[0]
  return interlocutor
}
