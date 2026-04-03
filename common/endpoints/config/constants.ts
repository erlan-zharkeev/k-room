export const ROUTE_NAMES = {
  login: '/login',
  registration: '/registration',
  emailConfirmation: '/email-confirmation',
  waitEmailConfirm: '/wait-email-confirm',
  main: '/app',
  passwordRecovery: '/password-recovery',
  createNewPassword: '/create-new-password',
  notification: '/notification',
  privacyPolicy: '/privacy-policy',
  notFound: '/not-found'
} as const

export const AUTH_ENDPOINTS = {
  registration: '/auth/registration',
  sendEmailConfirmationLink: '/auth/send-email-confirmation-link',
  confirmEmail: '/auth/confirm-email',
  login: '/auth/login',
  googleLogin: '/auth/google-login',
  providerLogin: '/auth/provider-login',
  logout: '/auth/logout',
  updateTokensPair: '/auth/token/refresh'
} as const

export const USER_ENDPOINTS = {
  getUserData: '/users/me',
  editUserData: '/users/me',
  resetPassword: '/user/reset-password',
  markInfoNotificationAsRead: '/users/me/notifications/read'
} as const

export const MEDIA_ENDPOINTS = {
  getMediaFile: '/media'
} as const

export const CODES_ENDPOINTS = {
  sendEmailCodePasswordRecovery: '/codes/email/password-recovery',
  validateEmailCodePasswordRecovery: '/codes/email/validate-email-code-password-recovery'
} as const

export const ADMIN_ENDPOINTS = {
  getAppData: '/admin/get-app-data',
  dbClear: '/admin/db-reset',
  applyFixtures: '/admin/apply-fixtures',
  deleteUser: '/admin/delete-user',
  updateUserData: '/admin/update-user-data'
} as const
