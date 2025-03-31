import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useUser } from 'src/entities/user'
import { resetStores } from 'src/features/global-store-reset'

export const useAuthMonitor = () => {
  const { isAuth } = useUser()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isAuth) {
      resetStores(dispatch)
    }
  }, [isAuth])
}
