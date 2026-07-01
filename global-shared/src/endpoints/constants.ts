export const LAYOUT_ROUTE_NAMES = {
  auth: '/authorize',
  page: '/page',
  docs: '/docs',
  app: '/app'
} as const

export const AUTH_ROUTE_NAMES = {
  login: 'login',
  registration: 'registration'
} as const

export const ROOT_ROUTE_NAMES = {
  download: '/download',
  notification: '/notification',
  notFound: '/not-found'
} as const

export const PAGE_ROUTE_NAMES = {
  emailConfirmation: 'email-confirmation',
  waitEmailConfirm: 'wait-email-confirm',
  passwordRecovery: 'password-recovery',
  createNewPassword: 'create-new-password',
  privacyPolicy: 'privacy-policy'
} as const

export const APP_ROUTE_NAMES = {
  chatRooms: 'chat-rooms',
  calls: 'calls',
  contacts: 'contacts',
  settings: 'settings'
} as const

export const ROUTE_NAMES = {
  authLogin: `${LAYOUT_ROUTE_NAMES.auth}/${AUTH_ROUTE_NAMES.login}`,
  authRegistration: `${LAYOUT_ROUTE_NAMES.auth}/${AUTH_ROUTE_NAMES.registration}`,
  emailConfirmation: `${LAYOUT_ROUTE_NAMES.page}/${PAGE_ROUTE_NAMES.emailConfirmation}`,
  waitEmailConfirm: `${LAYOUT_ROUTE_NAMES.page}/${PAGE_ROUTE_NAMES.waitEmailConfirm}`,
  app: LAYOUT_ROUTE_NAMES.app,
  passwordRecovery: `${LAYOUT_ROUTE_NAMES.page}/${PAGE_ROUTE_NAMES.passwordRecovery}`,
  createNewPassword: `${LAYOUT_ROUTE_NAMES.page}/${PAGE_ROUTE_NAMES.createNewPassword}`,
  download: ROOT_ROUTE_NAMES.download,
  notification: ROOT_ROUTE_NAMES.notification,
  privacyPolicy: `${LAYOUT_ROUTE_NAMES.docs}/${PAGE_ROUTE_NAMES.privacyPolicy}`,
  notFound: ROOT_ROUTE_NAMES.notFound
} as const

export const APP_ROUTE_PATHS = {
  chatRooms: `${ROUTE_NAMES.app}/${APP_ROUTE_NAMES.chatRooms}`,
  calls: `${ROUTE_NAMES.app}/${APP_ROUTE_NAMES.calls}`,
  contacts: `${ROUTE_NAMES.app}/${APP_ROUTE_NAMES.contacts}`,
  settings: `${ROUTE_NAMES.app}/${APP_ROUTE_NAMES.settings}`
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
  updateUserOnboarding: '/users/me/onboarding',
  changePassword: '/users/me/password',
  resetPassword: '/user/reset-password'
} as const

export const MEDIA_ENDPOINTS = {
  getMediaFile: '/media'
} as const

export const NOTIFICATION_ENDPOINTS = {
  getWebPushConfig: '/notifications/web-push/config',
  upsertWebPushSubscription: '/notifications/web-push/subscription',
  deleteWebPushSubscription: '/notifications/web-push/subscription'
} as const

export const CODES_ENDPOINTS = {
  sendEmailCodeChangeEmail: '/codes/email/change-email',
  validateEmailCodeChangeEmail: '/codes/email/validate-change-email',
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

export const MONITORING_ENDPOINTS = {
  sentryEnvelope: '/monitoring/envelope'
} as const

export const CLIENT_RUNTIME_ENDPOINTS = {
  getRuntimePolicy: '/client/runtime-policy'
} as const
