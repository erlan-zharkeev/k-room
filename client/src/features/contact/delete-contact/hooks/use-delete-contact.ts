import { SocketActionsType, IEventDeleteContactSuccess, IEventDeleteContact } from 'common-types'
import { useDispatch } from 'react-redux'

import { deleteContact } from 'src/entities/contact'
import { useNotification, ClientNotificationMessage } from 'src/entities/notification'
import { showModal, closeModal } from 'src/entities/system'

import { socket } from 'src/shared/api'

export const useDeleteContact = () => {
  const notifications = useNotification()
  const dispatch = useDispatch()

  const contactDeletedSuccessNotification = notifications.getNotification({
    messageType: 'info',
    message: ClientNotificationMessage.ContactDeleted
  })

  const deleteUserHandler = (id: string) => {
    dispatch(
      showModal({
        title: 'Confirmation',
        textContent: 'Are you sure you want to delete this contact?',
        confirmBtn: {
          text: 'Delete',
          callback: () => deleteContactConfirmed(id)
        }
      })
    )
  }

  const deleteContactConfirmed = (id: string) => {
    const payload: IEventDeleteContact = { deletingUserId: id }
    socket.emit<SocketActionsType>('delete-contact', payload)
    dispatch(closeModal())
  }

  const monitorContactDeletion = () => {
    socket.on<SocketActionsType>(
      'contact-delete-success',
      ({ deletedContactId, silent }: IEventDeleteContactSuccess) => {
        dispatch(deleteContact({ contactId: deletedContactId }))
        if (!silent) contactDeletedSuccessNotification.open()
      }
    )
  }

  return {
    deleteUserHandler,
    monitorContactDeletion
  }
}
