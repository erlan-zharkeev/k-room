import { SocketActionsType, EventChangeContactsDataType } from 'common'

import { useUpdateContactData } from 'src/features/update-contact-data'

import { socket } from 'src/shared/api'

export const useContactDataChange = () => {
  const { updateContactData } = useUpdateContactData()

  const updateContactDataHandler = async (payload: EventChangeContactsDataType) => {
    const { id } = payload
    updateContactData(id, payload)
    // ! TODO !
    // dispatch(changeChatName(payload))
  }

  const monitorContactDataChange = () => {
    socket.on<SocketActionsType>('contact-data-changed', updateContactDataHandler)
  }

  return {
    monitorContactDataChange
  }
}
