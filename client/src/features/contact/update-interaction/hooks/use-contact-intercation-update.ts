import { SocketActionsType, IEventUpdateContactInteractionSuccess } from 'common-types'
import { useDispatch } from 'react-redux'

import { updateContactInteractionType } from 'src/entities/contact'

import { socket } from 'src/shared/api'

export const useContactInteractionUpdate = () => {
  const dispatch = useDispatch()

  const monitorContactInteractionUpdate = () => {
    socket.on<SocketActionsType>(
      'contact-interaction-updated',
      ({ contactId, interaction }: IEventUpdateContactInteractionSuccess) => {
        dispatch(updateContactInteractionType({ contactId, interaction }))
      }
    )
  }

  return {
    monitorContactInteractionUpdate
  }
}
