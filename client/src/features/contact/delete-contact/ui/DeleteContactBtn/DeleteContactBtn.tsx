import './style.scss'
import { InteractionType } from 'common'

import { useDeleteContact } from 'src/features/contact/delete-contact/hooks'

import { AppButton } from 'src/shared/ui'

export const DeleteContactBtn = ({ interaction, id }: { interaction: InteractionType; id: string }) => {
  const { deleteUserHandler } = useDeleteContact()

  if (interaction === 'invite-received') return null

  return (
    <AppButton
      additionalClassName="delete-contact-btn"
      text="Delete"
      onClick={() => deleteUserHandler(id)}
      iconSize="xxs"
      small
      color="error-color"
      fill
    />
  )
}
