import { NotificationMessage, NotificationType } from 'common-types'
import { Auth, getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { $clg } from 'src/services/$clg'
import { AppDispatch } from 'src/store'
import { showNotification } from 'src/store/system-slice'

export enum FirebaseProviderType {
  google = 'google',
  facebook = 'facebook'
}

export const useFirebase = () => {
  const [auth, _] = useState<Auth>(getAuth())
  const dispatch = useDispatch<AppDispatch>()
  const [provider, setProvider] = useState<GoogleAuthProvider | FacebookAuthProvider | null>(null)

  const providers = {
    google: GoogleAuthProvider,
    facebook: FacebookAuthProvider
  }
  useEffect(() => {
    auth.languageCode = 'en'
  })

  const signIn = async (providerName: FirebaseProviderType) => {
    setProvider(new providers[providerName]())
    let result = null
    try {
      if (!provider) return
      result = await signInWithPopup(auth, provider)
    } catch (e: any) {
      $clg('error', e.message)
      dispatch(
        showNotification({
          message: NotificationMessage.failedToLogin,
          messageType: NotificationType.error
        })
      )
    }
    return result
  }
  return { signIn }
}
