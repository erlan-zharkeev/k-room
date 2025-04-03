import { useState } from 'react'

import { UserCredentialType, AuthEndpointsEnum } from 'common-types'
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { useDispatch } from 'react-redux'

import { ClientNotificationMessage, useNotification } from 'src/entities/notification'
import { commonSetUserDataHandler } from 'src/entities/user'

import { useApi } from 'src/shared/api'
import { clg } from 'src/shared/utils'

export type FirebaseProvider = 'google' | 'facebook'

const providers = {
  google: GoogleAuthProvider,
  facebook: FacebookAuthProvider
}

export const useFirebase = () => {
  const [loading, setLoading] = useState(false)
  const { doRequest } = useApi()
  const dispatch = useDispatch()

  const notifications = useNotification()

  const failedToLoginNotification = notifications.getNotification({
    message: ClientNotificationMessage.FailedToLogin,
    messageType: 'error'
  })

  const firebaseLogin = async (providerName: FirebaseProvider) => {
    const currentProvider = new providers[providerName]()
    try {
      const auth = getAuth()
      auth.languageCode = 'en'
      setLoading(true)
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
      commonSetUserDataHandler(dispatch, { userData, settings })
    } catch (e: unknown) {
      if (e instanceof Error) clg('error', e.message)
      failedToLoginNotification.open()
    } finally {
      setLoading(false)
    }
  }

  return { firebaseLogin, loading }
}
