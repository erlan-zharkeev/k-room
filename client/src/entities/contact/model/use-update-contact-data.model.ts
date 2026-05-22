import type { ContactRecord } from 'src/shared/lib'

import { useContact } from './use-contact.model'

export const useUpdateContactData = () => {
  const { update } = useContact()

  const updateContactData = async (id: string, updatedFields: Partial<ContactRecord>) => {
    await update(id, updatedFields)
  }

  return { updateContactData }
}
