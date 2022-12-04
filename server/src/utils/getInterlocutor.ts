import { User } from './../../../types/'

const getInterlocutor = (users: Array<User>, selfId: string): User => {
  const interlocutor = users.filter((user) => user.id !== selfId)[0]
  return interlocutor
}

export default getInterlocutor
