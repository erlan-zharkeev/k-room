import { DbContact } from 'src/shared/config'

import { useContact } from './use-contact'

export const useUpdateContactData = () => {
  const { update } = useContact()

  const updateContactData = async (id: string, updatedFields: Partial<DbContact>) => {
    update(id, updatedFields)
  }

  return { updateContactData }
}
