import { SocketActionsType, IEventGetContactTypingStatus } from 'common-types'

import { socket } from 'src/shared/api'

import { useUpdateContactData } from '../../update-contact-data'

export const useContactTypingMonitor = () => {
  const { updateContactData } = useUpdateContactData()

  const updateContactTypingStatus = async (payload: IEventGetContactTypingStatus) => {
    const { contactId, isTyping } = payload
    await updateContactData(contactId, { isTyping })
  }

  const monitorContactTyping = () => {
    socket.on<SocketActionsType>('get-contact-typing-status', updateContactTypingStatus)
  }

  return { monitorContactTyping }
}
