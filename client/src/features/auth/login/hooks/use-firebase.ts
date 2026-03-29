import { useState } from 'react'

import { AuthEndpointsEnum, RouteNamesEnum, FirebaseProviderType, ISignInWithProviderResponse } from 'common'
import { getAuth, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import { FIREBASE_PROVIDER_MAP } from 'src/features/auth/login'
import { useActivateUserSession } from 'src/features/user'

import { NOTIFICATION_I18N, useNotification } from 'src/entities/notification'
import { useI18n } from 'src/entities/system'

import { getHandledErrorMessage, useApi } from 'src/shared/api'
import { clg } from 'src/shared/utils'

export const useFirebase = () => {
  const [isFirebaseLoginLoading, setFirebaseLoginLoading] = useState(false)
  const { activateUserSession } = useActivateUserSession()
  const { doRequest } = useApi()
  const navigate = useNavigate()
  const notifications = useNotification()
  const { t } = useI18n()

  const failedToLoginNotification = notifications.getNotification({
    message: t(NOTIFICATION_I18N.failedToLogin),
    messageType: 'error'
  })

  const getFirebaseCredential = async (provider: FirebaseProviderType) => {
    if (import.meta.env.DEV && window.__E2E_FIREBASE_AUTH_RESULT__) {
      const { displayName, email, photoURL, uid, provider: e2eProvider } = window.__E2E_FIREBASE_AUTH_RESULT__

      return {
        displayName,
        email,
        photoURL,
        uid,
        provider: e2eProvider ?? provider
      }
    }

    const currentProvider = new FIREBASE_PROVIDER_MAP[provider]()
    const auth = getAuth()
    auth.languageCode = 'en'
    const result = await signInWithPopup(auth, currentProvider)
    const { displayName, email, photoURL, uid } = result.user

    return {
      displayName,
      email,
      photoURL,
      uid,
      provider
    }
  }

  const onFirebaseLogin = async (provider: FirebaseProviderType) => {
    try {
      setFirebaseLoginLoading(true)
      const { displayName, email, photoURL, uid, provider: normalizedProvider } = await getFirebaseCredential(provider)
      const haveFullData = displayName && email && uid && normalizedProvider
      if (!haveFullData) return
      const credential = {
        id: uid,
        username: displayName,
        email,
        avatar: photoURL,
        provider: normalizedProvider
      }

      const response = await doRequest<ISignInWithProviderResponse>('post', AuthEndpointsEnum.ProviderLogin, credential)
      if (!response) return
      const payload = response.data.payload
      activateUserSession(payload)
      navigate(RouteNamesEnum.Main)
    } catch (error: unknown) {
      clg('error', getHandledErrorMessage(error))
      failedToLoginNotification.open()
    } finally {
      setFirebaseLoginLoading(false)
    }
  }

  return { onFirebaseLogin, isFirebaseLoginLoading }
}
