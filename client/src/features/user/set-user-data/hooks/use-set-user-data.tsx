import { IFrontendUserData } from 'common-types'
import { useDispatch } from 'react-redux'

import { setAuth } from 'src/entities/system'
import { useUser } from 'src/entities/user'

import { socket } from 'src/shared/api'

export const useSetUserData = () => {
  const user = useUser()
  const dispatch = useDispatch()

  const setUserData = async (data: IFrontendUserData) => {
    await user.update(data)
    dispatch(setAuth('authorized'))
    socket.connect() // TODO Why here?
  }

  return { setUserData }
}
