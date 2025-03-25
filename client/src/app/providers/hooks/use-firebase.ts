import { Auth, getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { useNotification } from '../../../entities/notification/hooks/use-notification'
import { clg } from 'src/shared/utils'
import { ClientNotificationMessage } from 'src/entities/notification'

export type FirebaseProvider = 'google' | 'facebook'

export const useFirebase = () => {
  const [auth, _] = useState<Auth>(getAuth())
  const [provider, setProvider] = useState<GoogleAuthProvider | FacebookAuthProvider | null>(null)

  const providers = {
    google: GoogleAuthProvider,
    facebook: FacebookAuthProvider
  }

  useEffect(() => {
    auth.languageCode = 'en'
  })

  const notifications = useNotification()

  const failedToLoginNotification = notifications.getNotification({
    message: ClientNotificationMessage.FailedToLogin,
    messageType: 'error'
  })

  const login = async (providerName: FirebaseProvider) => {
    setProvider(new providers[providerName]())
    let result = null
    try {
      if (!provider) return
      result = await signInWithPopup(auth, provider)
    } catch (e: unknown) {
      if (e instanceof Error) clg('error', e.message)
      failedToLoginNotification.open()
    }
    return result
  }
  return { login }
}
