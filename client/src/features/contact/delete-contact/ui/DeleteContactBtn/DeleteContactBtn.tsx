import { InteractionType } from 'common-types'

import { AppButton } from 'src/shared/ui'

import { useDeleteContact } from '../../hooks'

export const DeleteContactBtn = ({ interaction, id }: { interaction: InteractionType; id: string }) => {
  const { deleteUserHandler } = useDeleteContact()

  return (
    <>
      {interaction !== 'invite-received' && (
        <AppButton prefixIconName="cross" onClick={() => deleteUserHandler(id)} borderless />
      )}
    </>
  )
}
