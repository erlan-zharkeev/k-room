import { DbContactType } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'

const contactStore = dexieCollectionStore<DbContactType>(db.contacts)

export const useContact = () => {
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
    get: (id: string) => contactStore.get(id),
    put: (payload: DbContactType) => contactStore.put(payload),
    bulkPut: (payload: DbContactType[]) => contactStore.bulkPut(payload),
    update: (id: string, patch: Partial<DbContactType>) => contactStore.update(id, patch),
    delete: (id: string) => contactStore.delete(id),
    mergeMany: (payload: DbContactType[], options: Parameters<typeof contactStore.mergeMany>[1]) =>
      contactStore.mergeMany(payload, options),
    reset: () => contactStore.reset()
  }
}
