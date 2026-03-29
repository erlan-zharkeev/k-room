
import { useContact } from 'src/entities/contact'

import { AppButton } from 'src/shared/ui'

import { useAddContact } from '../..'
import type { IAddContactBtnProps } from '../..'

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
