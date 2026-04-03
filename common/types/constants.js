export const VALIDATION_LIMITS = {
    passwordMinLength: 6,
    usernameMinLength: 2,
    usernameMaxLength: 32
};
export const VALIDATION_PATTERNS = {
    passwordStrong: `^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{${VALIDATION_LIMITS.passwordMinLength},}$`,
    noSpaces: '\\S+',
    onlyLatin: '^[\\x00-\\x7F]+$'
};
export const INFO_NOTIFICATION_STATUS = ['read', 'unread', 'hidden'];
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
};
export const AUTH_ENDPOINTS = {
    registration: '/auth/registration',
    sendEmailConfirmationLink: '/auth/send-email-confirmation-link',
    confirmEmail: '/auth/confirm-email',
    login: '/auth/login',
    googleLogin: '/auth/google-login',
    providerLogin: '/auth/provider-login',
    logout: '/auth/logout',
    updateTokensPair: '/auth/token/refresh'
};
export const USER_ENDPOINTS = {
    getUserData: '/users/me',
    editUserData: '/users/me',
    resetPassword: '/user/reset-password',
    markInfoNotificationAsRead: '/users/me/notifications/read'
};
export const MEDIA_ENDPOINTS = {
    getMediaFile: '/media'
};
export const CODES_ENDPOINTS = {
    sendEmailCodePasswordRecovery: '/codes/email/password-recovery',
    validateEmailCodePasswordRecovery: '/codes/email/validate-email-code-password-recovery'
};
export const ADMIN_ENDPOINTS = {
    getAppData: '/admin/get-app-data',
    dbClear: '/admin/db-reset',
    applyFixtures: '/admin/apply-fixtures',
    deleteUser: '/admin/delete-user',
    updateUserData: '/admin/update-user-data'
};
