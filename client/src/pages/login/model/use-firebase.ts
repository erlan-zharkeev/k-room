import { getAuth, signInWithPopup } from 'firebase/auth'
import {
  AUTH_ENDPOINTS,
  type FirebaseProviderType,
  type ISignInWithProviderPayload,
  type ISignInWithProviderResponse
} from 'global-shared'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'

import { useUserSession } from 'src/entities/user'
import { ERROR_TOAST_LIFE_MS, useApi } from 'src/shared/api'
import { CLIENT_ENV, CLIENT_LANGUAGE, TOAST_I18N } from 'src/shared/config'
import { useI18n } from 'src/shared/lib'

import { E2E_FIREBASE_AUTH_RESULT, FIREBASE_PROVIDER_MAP } from '../config/constants'
import { LOGIN_FORM_I18N } from '../config/i18n'

export const useFirebase = () => {
  const { doRequest } = useApi()
  const { activateUserSession } = useUserSession()
  const { t } = useI18n()
  const toast = useToast()
  const isFirebaseLoginLoading = ref(false)

  const getFirebaseCredential = async (provider: FirebaseProviderType) => {
    if (CLIENT_ENV.isE2E) {
      return E2E_FIREBASE_AUTH_RESULT
    }

    const Provider = FIREBASE_PROVIDER_MAP[provider]
    const currentProvider = new Provider()
    const auth = getAuth()

    auth.languageCode = CLIENT_LANGUAGE

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

  const buildCredential = async (provider: FirebaseProviderType): Promise<ISignInWithProviderPayload | null> => {
    try {
      const { displayName, email, photoURL, uid, provider: normalizedProvider } = await getFirebaseCredential(provider)
      const haveFullData = displayName && email && uid && normalizedProvider

      if (!haveFullData) return null

      return {
        username: displayName,
        email,
        avatar: photoURL ?? undefined,
        provider: normalizedProvider
      }
    } catch {
      toast.add({
        severity: 'error',
        summary: t(TOAST_I18N.error),
        detail: t(LOGIN_FORM_I18N.failedToLogin),
        life: ERROR_TOAST_LIFE_MS
      })

      return null
    }
  }

  const signInWithCredential = async (credential: ISignInWithProviderPayload) => {
    const response = await doRequest<ISignInWithProviderResponse>('post', AUTH_ENDPOINTS.providerLogin, credential)
    const { payload } = response.data

    await activateUserSession(payload)
  }

  const onFirebaseLogin = async (provider: FirebaseProviderType) => {
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
