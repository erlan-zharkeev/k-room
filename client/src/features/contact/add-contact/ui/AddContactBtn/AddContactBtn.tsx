import { useAddContact } from 'src/features/contact/add-contact'
import type { IAddContactBtnProps } from 'src/features/contact/add-contact'

import { useContact } from 'src/entities/contact'

import { AppButton } from 'src/shared/ui'

export const AddContactBtn = ({ id }: IAddContactBtnProps) => {
  const { isContactExist } = useContact()
  const { clickAddContactHandler, loading } = useAddContact()

  return (
    <>
      {!isContactExist(id) && (
        <AppButton
          prefixIconName="plus"
          color="accent-color"
          loading={loading}
          onClick={() => {
            clickAddContactHandler(id)
          }}
          borderless
        />
      )}
    </>
  )
}
