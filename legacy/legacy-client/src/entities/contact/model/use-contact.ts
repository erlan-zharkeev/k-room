import { DbContactType } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'

const contactStore = dexieCollectionStore<DbContactType>(db.contacts)

export const useContact = () => {
  const { get, put, bulkPut, update, remove, mergeMany, reset } = contactStore
  const contacts = contactStore.use()

  const getByIds = (ids: string[]): DbContactType[] => {
    if (!ids?.length) return []
    const map = new Map(contacts.map((c) => [c.id, c]))
    const result: DbContactType[] = []
    for (const id of ids) {
      const c = map.get(id)
      if (c) result.push(c)
    }
    return result
  }

  const isExist = (id: string) => Boolean(contacts?.some((c) => c.id === id))

  const invitationsQuantity = contacts.filter((c) => c.interactionType === 'invite-received').length

  return {
    contacts,
    invitationsQuantity,
    isExist,
    getByIds,
    get,
    put,
    bulkPut,
    update,
    remove,
    mergeMany,
    reset
  }
}
