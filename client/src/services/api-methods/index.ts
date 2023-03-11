import { updateTokensPair, registration, sendConfirmationLink, emailConfirm, signInWithProvider, login } from './auth'
import { resetPassword, updateUserData, getUserData, updateUserSettings } from './user'
import { sendEmailCodePasswordRecovery, validateEmailCodePasswordRecovery } from './codes'

export const apiMethods = {
  auth: {
    updateTokensPair,
    registration,
    sendConfirmationLink,
    emailConfirm,
    signInWithProvider,
    login
  },
  user: { resetPassword, updateUserData, getUserData, updateUserSettings },
  codes: { sendEmailCodePasswordRecovery, validateEmailCodePasswordRecovery }
}

export default apiMethods
