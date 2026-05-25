import { getRoomInterlocutorId } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import type { ChatRoomRecord } from 'src/shared/lib'

export const useChatRoomUserLookup = () => {
  const { contactById } = useContact()
  const { knownUserById } = useKnownUser()

  const getUserById = (id: string) => contactById.value.get(id) ?? knownUserById.value.get(id)
  const getRoomInterlocutor = (room: ChatRoomRecord, userId: string) => getUserById(getRoomInterlocutorId(room, userId))
  const getUsersByIds = (ids: readonly string[]) =>
    ids.reduce<NonNullable<ReturnType<typeof getUserById>>[]>((users, id) => {
      const user = getUserById(id)

      if (user) {
        users.push(user)
      }

      return users
    }, [])

  return {
    getRoomInterlocutor,
    getUserById,
    getUsersByIds
  }
}
