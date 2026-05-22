import { getAuth, signInWithPopup } from 'firebase/auth'
import {
  AUTH_ENDPOINTS,
  type FirebaseProvider,
  type SignInWithProviderPayload,
  type SignInWithProviderResponse
} from 'global-shared'
import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useUserSession } from 'src/entities/user'
import { useHttp } from 'src/shared/api'
import { TOAST_I18N } from 'src/shared/lib'
import { useI18n } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib'

import { E2E_FIREBASE_AUTH_RESULT, FIREBASE_PROVIDER_MAP } from '../config/constants'
import { LOGIN_FORM_I18N } from '../config/i18n'

export const useFirebase = () => {
  const { doHttpRequest } = useHttp()
  const { activateUserSession } = useUserSession()
  const { settings } = useSettings()
  const { t } = useI18n()
  const toast = useAppToast()
  const isFirebaseLoginLoading = ref(false)

  const getFirebaseCredential = async (provider: FirebaseProvider) => {
    if (__CLIENT_ENV_DATA__.isE2E) {
      return E2E_FIREBASE_AUTH_RESULT
    }

    const Provider = FIREBASE_PROVIDER_MAP[provider]
    const currentProvider = new Provider()
    const auth = getAuth()

    auth.languageCode = settings.value.localization.language

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

  const buildCredential = async (provider: FirebaseProvider): Promise<SignInWithProviderPayload | null> => {
    try {
      const { displayName, email, photoURL, uid, provider: normalizedProvider } = await getFirebaseCredential(provider)
      const haveFullData = displayName && email && uid && normalizedProvider

      if (!haveFullData) return null

      return {
        nickname: uuidv4().replace(/-/g, ''),
        email,
        avatar: photoURL ?? undefined,
        provider: normalizedProvider
      }
    } catch (error) {
      void error

      toast.add({
        type: 'error',
        title: t(TOAST_I18N.error),
        content: t(LOGIN_FORM_I18N.failedToLogin)
      })

      return null
    }
  }

  const signInWithCredential = async (credential: SignInWithProviderPayload) => {
    const response = await doHttpRequest<SignInWithProviderResponse>('post', AUTH_ENDPOINTS.providerLogin, credential)
    const { payload } = response.data

    await activateUserSession(payload)
  }

  const onFirebaseLogin = async (provider: FirebaseProvider) => {
    isFirebaseLoginLoading.value = true

    try {
      const credential = await buildCredential(provider)

      if (!credential) return

      await signInWithCredential(credential)
    } finally {
      isFirebaseLoginLoading.value = false
    }
  }

  return {
    isFirebaseLoginLoading,
    onFirebaseLogin
  }
}
