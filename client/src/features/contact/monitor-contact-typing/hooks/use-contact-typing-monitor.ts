import { SocketActionsType, IEventGetContactTypingStatus } from 'common'

import { useUpdateContactData } from 'src/features/contact/update-contact-data'

import { socket } from 'src/shared/api'

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
