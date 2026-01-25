import { SocketActionsType, EventChangeContactsDataType } from 'common-types'

import { socket } from 'src/shared/api'

import { useUpdateContactData } from '../../update-contact-data'

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
