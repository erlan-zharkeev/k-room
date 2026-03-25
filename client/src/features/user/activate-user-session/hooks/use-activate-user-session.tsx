import { IFrontendUserData, SocketActionsType } from 'common'
import { useDispatch } from 'react-redux'

import { useSocketConnect } from 'src/features/socket'

import { setAuth } from 'src/entities/system'
import { useUser } from 'src/entities/user'

import { socket } from 'src/shared/api'

export const useActivateUserSession = () => {
  const user = useUser()

  const dispatch = useDispatch()
  const { socketConnect } = useSocketConnect()

  const activateUserSession = async (data: IFrontendUserData) => {
    socket.emit<SocketActionsType>('actualize-user-data')
    await user.update(data)
    dispatch(setAuth('authorized'))
    socketConnect()
  }

  return { activateUserSession }
}
