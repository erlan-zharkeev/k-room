import { useLiveQuery } from 'dexie-react-hooks'

import type { DbContactType } from 'src/shared/config'
import { db } from 'src/shared/lib'

// import { MOCK } from 'src/entities/contact/config'

export const useContact = () => {
  const contacts =
    useLiveQuery(async () => {
      return await (db.contacts.toArray() as Promise<DbContactType[]>)
    }, []) ?? []

  const getContactByIds = (ids: string[]): DbContactType[] => {
    if (!ids?.length) return []
    const map = new Map(contacts.map((c) => [c.id, c] as const))
    const result: DbContactType[] = []
    for (const id of ids) {
      const c = map.get(id)
      if (c) result.push(c)
    }
    return result
  }

  const isContactExist = (id: string) => Boolean(contacts?.some((c) => c.id === id))

  const putContact = async (payload: DbContactType) => await db.contacts.put(payload)

  const updateContact = async (id: string, patch: Partial<DbContactType>) => {
    await db.contacts.update(id, patch)
  }

  const reset = () => db.contacts.clear()

  return {
    contacts,
    contactInvitationsQuantity: contacts?.filter((c) => c.interactionType === 'invite-received').length ?? 0,
    isContactExist,
    getContactByIds,
    putContact,
    updateContact,
    reset
  }
}
