import { getRoomInterlocutorId } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useUser } from 'src/entities/user'
import type { ChatRoomRecord, KnownUserRecord } from 'src/shared/lib'

export const useChatRoomUserLookup = () => {
  const { contactById } = useContact()
  const { knownUserById } = useKnownUser()
  const { user } = useUser()

  const getUserById = (id: string) => {
    const selfUser: KnownUserRecord | undefined =
      user.value.id === id
        ? {
            avatarId: user.value.avatarId,
            id: user.value.id,
            isTyping: false,
            lastSeen: Date.now(),
            nickname: user.value.nickname,
            online: true
          }
        : undefined

    return contactById.value.get(id) ?? knownUserById.value.get(id) ?? selfUser
  }
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
