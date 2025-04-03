import { SocketActionsType, IEventInviteReceived } from 'common-types'
import { useDispatch } from 'react-redux'
import { acceptInvite } from 'src/entities/contact'
import { socket } from 'src/shared/api'

export const useInviteSend = () => {
  const dispatch = useDispatch()

  const monitorInvitationReceipt = () => {
    socket.on<SocketActionsType>('invite-received', (payload: IEventInviteReceived) => {
      dispatch(acceptInvite(payload))
    })
  }
  return { monitorInvitationReceipt }
}
