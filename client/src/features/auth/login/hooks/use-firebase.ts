import { useState } from 'react'

import { AuthEndpointsEnum, RouteNamesEnum, FirebaseProviderType, ISignInWithProviderResponse } from 'common-types'
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import { useActivateUserSession } from 'src/features/user'

import { NOTIFICATION_MESSAGE, useNotification } from 'src/entities/notification'

import { useApi } from 'src/shared/api'
import { clg } from 'src/shared/utils'

const providers = {
  google: GoogleAuthProvider,
  facebook: FacebookAuthProvider
}

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
    const currentProvider = new providers[provider]()
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
      const { data } = response.data
      activateUserSession(data)
      navigate(RouteNamesEnum.Main)
    } catch (e: unknown) {
      if (e instanceof Error) clg('error', e.message)
      failedToLoginNotification.open()
    } finally {
      setFirebaseLoginLoading(false)
    }
  }

  return { onFirebaseLogin, isFirebaseLoginLoading }
}
