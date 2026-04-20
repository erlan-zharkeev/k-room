import { SocketActionsType, IEventUpdateContactInteractionSuccess } from 'common'

import { useUpdateContactData } from 'src/features/update-contact-data'

import { socket } from 'src/shared/api'

export const useContactInteractionUpdate = () => {
  const { updateContactData } = useUpdateContactData()

  const updateContactInteractionType = async (payload: IEventUpdateContactInteractionSuccess) => {
    const { contactId, interaction } = payload
    await updateContactData(contactId, { interactionType: interaction })
  }

  const monitorContactInteractionUpdate = () => {
    socket.on<SocketActionsType>('contact-interaction-updated', updateContactInteractionType)
  }

  return {
    monitorContactInteractionUpdate
  }
}
