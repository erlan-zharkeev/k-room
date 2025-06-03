import { IUserData } from 'common-types'

import { useContact } from 'src/entities/contact'

import { AppButton } from 'src/shared/ui'

import { useAddContact } from '../../hooks'

export const AddContactBtn = ({ id, searchedContacts }: { id: string; searchedContacts: IUserData[] }) => {
  const { isContactExist } = useContact()
  const { clickAddContactHandler } = useAddContact()

  return (
    <>
      {!isContactExist(id) && (
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
