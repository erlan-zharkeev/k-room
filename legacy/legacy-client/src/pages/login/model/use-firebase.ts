import { useState } from 'react'

import { getAuth, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import { AUTH_ENDPOINTS, ROUTE_NAMES, FirebaseProvider, ISignInWithProviderResponse } from 'common'

import { useActivateUserSession } from 'src/entities/user'

import { useApi } from 'src/shared/api'
import { CLIENT_ENV } from 'src/shared/config'
import { handleRuntimeError } from 'src/shared/lib'
import { NOTIFICATION_I18N, useNotification } from 'src/shared/notification'
import { useI18n, useSettings } from 'src/shared/preferences'

import { E2E_FIREBASE_AUTH_RESULT, FIREBASE_PROVIDER_MAP } from '../constants'

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

  const getFirebaseCredential = async (provider: FirebaseProvider) => {
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

  const buildCredential = async (provider: FirebaseProvider) => {
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
      const response = await doRequest<ISignInWithProviderResponse>('post', AUTH_ENDPOINTS.providerLogin, credential)
      const payload = response.data.payload
      activateUserSession(payload)
      navigate(ROUTE_NAMES.main)
    } catch {
      //
    }
  }

  const onFirebaseLogin = async (provider: FirebaseProvider) => {
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
