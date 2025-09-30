import { IFrontendUserData } from 'common-types'
import { useDispatch } from 'react-redux'

import { useSocketConnect } from 'src/features/socket'

import { setAuth } from 'src/entities/system'
import { useUser } from 'src/entities/user'

export const useActivateUserSession = () => {
  const user = useUser()

  const dispatch = useDispatch()
  const { socketConnect } = useSocketConnect()

  const activateUserSession = async (data: IFrontendUserData) => {
    await user.update(data)
    dispatch(setAuth('authorized'))
    socketConnect()
  }

  return { activateUserSession }
}
