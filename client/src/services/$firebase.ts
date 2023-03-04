import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, Auth } from 'firebase/auth'
import { AppDispatch, store } from 'src/store'
import { showNotification } from 'src/store/systemSlice'
import $clg from './$clg'

export type ProviderType = 'google' | 'facebook'

const commonErrors = {
  'Firebase: Error (auth/account-exists-with-different-credential).':
    'Log in using the current data, the user`s data is linked to another login method'
} as { [key: string]: string }

export class Firebase {
  providerName: ProviderType
  auth: Auth
  providers: {
    [key: string]: typeof GoogleAuthProvider | typeof FacebookAuthProvider
  }
  provider: GoogleAuthProvider | FacebookAuthProvider
  dispatch: AppDispatch
  constructor() {
    this.auth = getAuth()
    this.auth.languageCode = 'en' // Set dynamic when i18n will be developed
    this.providers = {
      google: GoogleAuthProvider,
      facebook: FacebookAuthProvider
    }
    this.dispatch = store.dispatch
  }
  async signIn(providerName: ProviderType) {
    this.providerName = providerName
    this.provider = new this.providers[this.providerName]()
    let result = null
    try {
      result = await signInWithPopup(this.auth, this.provider)
    } catch (e: any) {
      $clg('error', e.message)
      const readableError = commonErrors[e.message] ?? 'Login failed, server error. Please try again, later'
      this.dispatch(
        showNotification({
          message: readableError,
          messageType: 'error'
        })
      )
    }
    return result
  }
}

export default new Firebase()
