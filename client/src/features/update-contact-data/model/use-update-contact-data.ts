import { useContact } from 'src/entities/contact'

import { DbContactType } from 'src/shared/config'

export const useUpdateContactData = () => {
  const { update } = useContact()
  const updateContactData = async (id: string, updatedFields: Partial<DbContactType>) => {
    update(id, updatedFields)
  }

  return { updateContactData }
}
