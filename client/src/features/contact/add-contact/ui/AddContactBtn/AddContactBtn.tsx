import { IUserData } from 'common-types'

import { useContact } from 'src/entities/contact'

import { AppButton } from 'src/shared/ui'

import { useAddContact } from '../../hooks'

export const AddContactBtn = ({ id, searchedContacts }: { id: string; searchedContacts: IUserData[] }) => {
  const { isContactExistById } = useContact()
  const { clickAddContactHandler } = useAddContact()

  return (
    <>
      {!isContactExistById(id) && (
        <AppButton
          prefixIconName="plus"
          color="accent-color"
          onClick={() => {
            clickAddContactHandler(id, searchedContacts)
          }}
          borderless
        />
      )}
    </>
  )
}
