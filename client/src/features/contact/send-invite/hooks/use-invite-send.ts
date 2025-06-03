import { SocketActionsType, IEventInviteReceived } from 'common-types'
import { useDispatch } from 'react-redux'

import { processInvitation } from 'src/entities/contact'
import { useNotification } from 'src/entities/notification'

import { socket } from 'src/shared/api'

export const useInviteSend = () => {
  const dispatch = useDispatch()
  const { openBrowserNotification } = useNotification()

  const monitorInvitation = () => {
    socket.on<SocketActionsType>('invite-received', (payload: IEventInviteReceived) => {
      dispatch(processInvitation(payload))
      openBrowserNotification({
        message: {
          authorName: payload.contactData.username,
          body: 'Invite received'
        },
        icon: payload.contactData.avatarPath
      })
    })
  }
  return { monitorInvitation }
}
