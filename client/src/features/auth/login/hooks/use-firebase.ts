import { useState } from 'react'

import { UserCredentialType, AuthEndpointsEnum, RouteNamesEnum } from 'common-types'
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import { useSetUserData } from 'src/features/user/set-user-data/hooks/use-set-user-data'

import { ClientNotificationMessage, useNotification } from 'src/entities/notification'

import { useApi } from 'src/shared/api'
import { clg } from 'src/shared/utils'

export type FirebaseProvider = 'google' | 'facebook'

const providers = {
  google: GoogleAuthProvider,
  facebook: FacebookAuthProvider
}

export const useFirebase = () => {
  const [isFirebaseLoginLoading, setFirebaseLoginLoading] = useState(false)
  const { setUserData } = useSetUserData()
  const { doRequest } = useApi()
  const navigate = useNavigate()
  const notifications = useNotification()

  const failedToLoginNotification = notifications.getNotification({
    message: ClientNotificationMessage.FailedToLogin,
    messageType: 'error'
  })

  const onFirebaseLogin = async (providerName: FirebaseProvider) => {
    const currentProvider = new providers[providerName]()
    try {
      const auth = getAuth()
      auth.languageCode = 'en'
      setFirebaseLoginLoading(true)
      const result = await signInWithPopup(auth, currentProvider)

      const { displayName, email, photoURL, uid } = result.user
      const { providerId } = result
      const haveFullData = displayName && email && photoURL && uid && providerId
      if (!haveFullData) return
      const credential: UserCredentialType = {
        id: uid,
        username: displayName,
        email,
        avatarPath: photoURL,
        providerName: providerId
      }

      const response = await doRequest('post', AuthEndpointsEnum.ProviderLogin, credential)
      if (!response) return
      const { userData, settings } = response.data
      setUserData({ userData, settings })
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
