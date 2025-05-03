import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { useFetchUserData } from 'src/features/user'

import { updateAppLoaderState } from 'src/entities/system'

import { getCookie } from 'src/shared/utils'

export const useCheckAuth = () => {
  const dispatch = useDispatch()
  const { fetchUserData } = useFetchUserData()

  const checkAuth = () => {
    const hasJwt = Boolean(getCookie('jwt'))
    dispatch(updateAppLoaderState(hasJwt))
    if (hasJwt) fetchUserData()
  }

  useEffect(() => {
    checkAuth()
  }, [])
}
