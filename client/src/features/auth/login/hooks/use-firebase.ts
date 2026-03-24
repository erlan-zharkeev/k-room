import { useState } from 'react'

import { AuthEndpointsEnum, RouteNamesEnum, FirebaseProviderType, ISignInWithProviderResponse } from 'common-types'
import { getAuth, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import { FIREBASE_PROVIDER_MAP } from 'src/features/auth/login/config'
import { useActivateUserSession } from 'src/features/user'

import { NOTIFICATION_MESSAGE, useNotification } from 'src/entities/notification'

import { ApiError, useApi } from 'src/shared/api'
import { clg } from 'src/shared/utils'

export const useFirebase = () => {
  const [isFirebaseLoginLoading, setFirebaseLoginLoading] = useState(false)
  const { activateUserSession } = useActivateUserSession()
  const { doRequest } = useApi()
  const navigate = useNavigate()
  const notifications = useNotification()

  const failedToLoginNotification = notifications.getNotification({
    message: NOTIFICATION_MESSAGE.failedToLogin(),
    messageType: 'error'
  })

  const onFirebaseLogin = async (provider: FirebaseProviderType) => {
    const currentProvider = new FIREBASE_PROVIDER_MAP[provider]()
    try {
      const auth = getAuth()
      auth.languageCode = 'en'
      setFirebaseLoginLoading(true)
      const result = await signInWithPopup(auth, currentProvider)

      const { displayName, email, photoURL, uid } = result.user
      const { providerId } = result
      const haveFullData = displayName && email && photoURL && uid && providerId
      if (!haveFullData) return
      const credential = {
        id: uid,
        username: displayName,
        email,
        avatar: photoURL,
        provider: providerId
      }

      const response = await doRequest<ISignInWithProviderResponse>('post', AuthEndpointsEnum.ProviderLogin, credential)
      if (!response) return
      const payload = response.data.payload
      activateUserSession(payload)
      navigate(RouteNamesEnum.Main)
    } catch (error: unknown) {
      if (error instanceof ApiError || error instanceof Error) {
        clg('error', error.message)
      }

      failedToLoginNotification.open()
    } finally {
      setFirebaseLoginLoading(false)
    }
  }

  return { onFirebaseLogin, isFirebaseLoginLoading }
}
