import { NotificationMessage, NotificationType } from 'common-types'
import { Auth, getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { $clg } from 'src/services/$clg'
import { useNotification } from './use-notification'

export enum FirebaseProviderType {
  google = 'google',
  facebook = 'facebook'
}

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

  const notifications = useNotification();

  const failedToLoginNotification = notifications.getNotification({
    message: NotificationMessage.failedToLogin,
    messageType: NotificationType.error
  })

  const signIn = async (providerName: FirebaseProviderType) => {
    setProvider(new providers[providerName]())
    let result = null
    try {
      if (!provider) return
      result = await signInWithPopup(auth, provider)
    } catch (e: unknown) {
      if (e instanceof Error) $clg('error', e.message)
      failedToLoginNotification.open()
    }
    return result
  }
  return { signIn }
}
