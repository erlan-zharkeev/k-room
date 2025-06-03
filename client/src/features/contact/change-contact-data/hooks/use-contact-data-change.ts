import { SocketActionsType, IEventChangeContactsData } from 'common-types'
import { useDispatch } from 'react-redux'

import { changeChatName } from 'src/entities/chat-room'
import { updateContactData } from 'src/entities/contact'

import { socket } from 'src/shared/api'

export const useContactDataChange = () => {
  const dispatch = useDispatch()

  const monitorContactDataChange = () => {
    socket.on<SocketActionsType>('contact-data-changed', (payload: IEventChangeContactsData) => {
      dispatch(updateContactData(payload))
      dispatch(changeChatName(payload))
    })
  }

  return {
    monitorContactDataChange
  }
}
