import { useDispatch } from 'react-redux'

import { IFrontendUserData } from 'common'

import { useSocketConnect } from 'src/features/socket'

import { useUser } from 'src/entities/user'

import { setAuth } from 'src/shared/system'
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
