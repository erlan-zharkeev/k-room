import { useContact } from 'src/entities/contact'

import type { DbContactType } from 'src/shared/config'

export const useUpdateContactData = () => {
  const { updateContact } = useContact()
  const updateContactData = async (id: string, updatedFields: Partial<DbContactType>) => {
    updateContact(id, updatedFields)
  }

  return { updateContactData }
}
