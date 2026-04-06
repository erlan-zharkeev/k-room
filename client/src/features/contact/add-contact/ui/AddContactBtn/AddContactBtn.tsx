import { useAddContact, IAddContactBtnProps } from 'src/features/contact'

import { useContact } from 'src/entities/contact'

import { AppButton } from 'src/shared/ui'

export const AddContactBtn = ({ id }: IAddContactBtnProps) => {
  const { isExist } = useContact()
  const { clickAddContactHandler, loading } = useAddContact()

  return (
    <>
      {!isExist(id) && (
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
