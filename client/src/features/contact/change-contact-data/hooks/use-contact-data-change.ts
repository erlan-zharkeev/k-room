import { SocketActionsType, IEventChangeContactsData } from 'common-types'
import { useDispatch } from 'react-redux'

import { changeChatName } from 'src/entities/chat-room'

import { socket } from 'src/shared/api'

import { useUpdateContactData } from '../../update-contact-data'

export const useContactDataChange = () => {
  const dispatch = useDispatch()
  const { updateContactData: update } = useUpdateContactData()

  const updateContactData = async (payload: IEventChangeContactsData) => {
    const { id } = payload
    update(id, payload)
    // ! TODO !
    dispatch(changeChatName(payload))
  }

  const monitorContactDataChange = () => {
    socket.on<SocketActionsType>('contact-data-changed', updateContactData)
  }

  return {
    monitorContactDataChange
  }
}
