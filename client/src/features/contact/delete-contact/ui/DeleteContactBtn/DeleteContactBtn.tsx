import './style.scss'
import { InteractionType } from 'common-types'

import { AppButton } from 'src/shared/ui'

import { useDeleteContact } from '../../hooks'

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
