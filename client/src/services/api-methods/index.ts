import { updateTokensPair, registration, sendConfirmationLink, emailConfirm, signInWithProvider, login } from './auth'
import { resetPassword, updateUserData, getUserData } from './user'
import { sendEmailCodePasswordRecovery, validateEmailCodePasswordRecovery } from './codes'
import { markInfoAsRead } from './common'

const apiMethods = {
  auth: {
    updateTokensPair,
    registration,
    sendConfirmationLink,
    emailConfirm,
    signInWithProvider,
    login
  },
  user: { resetPassword, updateUserData, getUserData, markInfoAsRead },
  codes: { sendEmailCodePasswordRecovery, validateEmailCodePasswordRecovery },
  common: { markInfoAsRead }
}

export default apiMethods
