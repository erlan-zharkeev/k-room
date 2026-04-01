import { useState } from 'react'

import { AuthEndpointsEnum, RouteNamesEnum, FirebaseProviderType, ISignInWithProviderResponse } from 'common'
import { getAuth, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import { E2E_FIREBASE_AUTH_RESULT, FIREBASE_PROVIDER_MAP } from 'src/features/auth'
import { useActivateUserSession } from 'src/features/user'

import { NOTIFICATION_I18N, useNotification } from 'src/entities/notification'
import { useI18n, useSettings } from 'src/entities/settings'

import { useApi } from 'src/shared/api'
import { CLIENT_ENV } from 'src/shared/config'
import { handleRuntimeError } from 'src/shared/lib'

export const useFirebase = () => {
  const [isFirebaseLoginLoading, setFirebaseLoginLoading] = useState(false)
  const { activateUserSession } = useActivateUserSession()
  const { doRequest } = useApi()
  const { language } = useSettings()
  const navigate = useNavigate()
  const notifications = useNotification()
  const { t } = useI18n()

  const failedToLoginNotification = notifications.getNotification({
    message: t(NOTIFICATION_I18N.failedToLogin),
    messageType: 'error'
  })

  const getFirebaseCredential = async (provider: FirebaseProviderType) => {
    if (CLIENT_ENV.isE2E) {
      return E2E_FIREBASE_AUTH_RESULT
    }

    const currentProvider = new FIREBASE_PROVIDER_MAP[provider]()
    const auth = getAuth()
    auth.languageCode = language
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

  const buildCredential = async (provider: FirebaseProviderType) => {
    try {
      const { displayName, email, photoURL, uid, provider: normalizedProvider } = await getFirebaseCredential(provider)
      const haveFullData = displayName && email && uid && normalizedProvider
      if (!haveFullData) return null
      return { id: uid, username: displayName, email, avatar: photoURL, provider: normalizedProvider }
    } catch (error) {
      handleRuntimeError('Firebase login failed', error)
      failedToLoginNotification.open()
      return null
    }
  }

  const signInWithCredential = async (credential: NonNullable<Awaited<ReturnType<typeof buildCredential>>>) => {
    try {
      const response = await doRequest<ISignInWithProviderResponse>('post', AuthEndpointsEnum.ProviderLogin, credential)
      const payload = response.data.payload
      activateUserSession(payload)
      navigate(RouteNamesEnum.Main)
    } catch {}
  }

  const onFirebaseLogin = async (provider: FirebaseProviderType) => {
    try {
      setFirebaseLoginLoading(true)
      const credential = await buildCredential(provider)
      if (!credential) return
      await signInWithCredential(credential)
    } finally {
      setFirebaseLoginLoading(false)
    }
  }

  return { onFirebaseLogin, isFirebaseLoginLoading }
}
