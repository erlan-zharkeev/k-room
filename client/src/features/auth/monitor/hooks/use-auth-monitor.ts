import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { resetStores } from 'src/features/global-store-reset'

import { useUser } from 'src/entities/user'

export const useAuthMonitor = () => {
  const { isAuth } = useUser()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isAuth) {
      resetStores(dispatch)
    }
  }, [isAuth])
}
