import { IFrontendUserData } from 'common'
import { useDispatch } from 'react-redux'

import { useSocketConnect } from 'src/features/socket'

import { setAuth } from 'src/entities/system'
import { useUser } from 'src/entities/user'
export const useActivateUserSession = () => {
  const user = useUser()

  const dispatch = useDispatch()
  const { socketConnect } = useSocketConnect()

  const activateUserSession = async (data: IFrontendUserData) => {
    await user.shallowUpdate(data)
    dispatch(setAuth('authorized'))
    socketConnect()
  }

  return { activateUserSession }
}
