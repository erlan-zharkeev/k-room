import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, Auth } from 'firebase/auth'
import { AppDispatch } from 'src/store'
import { showNotification } from 'src/store/systemSlice'
import $clg from 'src/services/$clg'
import { NotificationType } from 'common-types'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

export enum FirebaseProviderType {
  google = 'google',
  facebook = 'facebook'
}

const commonErrors = {
  'Firebase: Error (auth/account-exists-with-different-credential).': 'Account exists with different credential'
} as Record<string, string>

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
      const readableError = commonErrors[e.message] ?? 'Login failed, server error. Please try again, later'
      dispatch(
        showNotification({
          message: readableError,
          messageType: NotificationType.error
        })
      )
    }
    return result
  }
  return { signIn }
}

export default useFirebase
