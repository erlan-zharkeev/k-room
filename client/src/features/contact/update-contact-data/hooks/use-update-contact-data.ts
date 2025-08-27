import type { DbContactType } from 'src/shared/config'
import { db } from 'src/shared/lib'

export const useUpdateContactData = () => {
  const updateContactData = async (id: string, updatedFields: Partial<DbContactType>) => {
    const contact = await db.contacts.get(id)
    if (!contact) return
    await db.contacts.put({
      ...contact,
      ...updatedFields
    })
  }

  return { updateContactData }
}
