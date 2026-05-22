import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'

export const useChatRoomUserLookup = () => {
  const { contactById } = useContact()
  const { knownUserById } = useKnownUser()

  const getUserById = (id: string) => contactById.value.get(id) ?? knownUserById.value.get(id)
  const getUsersByIds = (ids: readonly string[]) =>
    ids.reduce<NonNullable<ReturnType<typeof getUserById>>[]>((users, id) => {
      const user = getUserById(id)

      if (user) {
        users.push(user)
      }

      return users
    }, [])

  return {
    getUserById,
    getUsersByIds
  }
}
