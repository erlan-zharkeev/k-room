import { en as nmorphEn, ru as nmorphRu, zh as nmorphZh } from '@nmorph/nmorph-ui-kit'

import { APP_I18N } from 'src/app/config/i18n'
import { AUTH_LAYOUT_I18N } from 'src/app/layouts/auth-layout/i18n'
import { APP_NAVIGATION_I18N } from 'src/features/app-navigation'
import { APP_WELCOME_I18N } from 'src/features/app-welcome'
import { CHAT_ROOM_CONTEXT_MENU_I18N } from 'src/features/chat-room-context-menu'
import { CHAT_ROOM_TYPING_I18N } from 'src/features/chat-room-typing'
import { CONTENT_NAVIGATION_BACK_BUTTON_I18N } from 'src/features/content-navigation-back-button'
import { ONBOARDING_GUIDE_I18N } from 'src/features/onboarding-guide'
import { PAGE_BACK_BUTTON_I18N } from 'src/features/page-back-button'
import { ROOM_CALL_SESSION_I18N } from 'src/features/room-call-session'
import { SELECT_LANGUAGE_I18N } from 'src/features/select-language'
import { SELECT_THEME_I18N } from 'src/features/select-theme'
import { UPDATE_NATIVE_DESKTOP_I18N } from 'src/features/update-native-desktop'
import { USER_ACTIVITY_STATUS_I18N } from 'src/features/user-activity-status'
import { CALLS_PAGE_I18N } from 'src/pages/calls'
import { CONTACTS_PAGE_I18N } from 'src/pages/contacts'
import { CREATE_NEW_PASSWORD_I18N } from 'src/pages/create-new-password'
import { DOWNLOAD_PAGE_I18N } from 'src/pages/download'
import { EMAIL_CONFIRMATION_I18N } from 'src/pages/email-confirmation'
import { ERROR_PAGE_I18N } from 'src/pages/error'
import { LOGIN_FORM_I18N } from 'src/pages/login'
import { PASSWORD_RECOVERY_I18N } from 'src/pages/password-recovery'
import { LEGAL_INFO_PAGE_I18N } from 'src/pages/privacy-policy'
import { REGISTRATION_FORM_I18N } from 'src/pages/registration'
import {
  SETTINGS_ACCOUNT_CHANGE_EMAIL_I18N,
  SETTINGS_ACCOUNT_CHANGE_PASSWORD_I18N,
  SETTINGS_ACCOUNT_PERSONAL_DATA_I18N,
  SETTINGS_PAGE_ACCOUNT_I18N,
  SETTINGS_PAGE_APPEARANCE_I18N,
  SETTINGS_PAGE_DEVICES_I18N,
  SETTINGS_PAGE_FAQ_I18N,
  SETTINGS_PAGE_GENERAL_I18N,
  SETTINGS_PAGE_NOTIFICATIONS_I18N,
  SETTINGS_PAGE_ROADMAP_I18N,
  SETTINGS_PAGE_STORAGE_I18N
} from 'src/pages/settings'
import { WAIT_EMAIL_CONFIRM_I18N } from 'src/pages/wait-email-confirm'
import { API_I18N, SOCKET_I18N } from 'src/shared/api'
import { BROWSER_I18N, buildI18nMessages, DB_QUOTA_I18N, TOAST_I18N } from 'src/shared/lib'
import { APP_CAPTCHA_I18N } from 'src/shared/ui'
import { CHAT_ROOM_CONTENT_I18N } from 'src/widgets/chat-room-content'
import { CHAT_ROOMS_NAVIGATION_I18N } from 'src/widgets/chat-rooms-navigation'
import { TOP_BAR_I18N } from 'src/widgets/top-bar'

const appI18nMessages = buildI18nMessages([
  APP_I18N,
  AUTH_LAYOUT_I18N,
  APP_NAVIGATION_I18N,
  APP_WELCOME_I18N,
  CHAT_ROOM_CONTEXT_MENU_I18N,
  CHAT_ROOM_TYPING_I18N,
  CONTENT_NAVIGATION_BACK_BUTTON_I18N,
  SELECT_LANGUAGE_I18N,
  UPDATE_NATIVE_DESKTOP_I18N,
  ONBOARDING_GUIDE_I18N,
  PAGE_BACK_BUTTON_I18N,
  ROOM_CALL_SESSION_I18N,
  SELECT_THEME_I18N,
  USER_ACTIVITY_STATUS_I18N,
  CALLS_PAGE_I18N,
  CONTACTS_PAGE_I18N,
  CREATE_NEW_PASSWORD_I18N,
  DOWNLOAD_PAGE_I18N,
  EMAIL_CONFIRMATION_I18N,
  ERROR_PAGE_I18N,
  LOGIN_FORM_I18N,
  PASSWORD_RECOVERY_I18N,
  LEGAL_INFO_PAGE_I18N,
  REGISTRATION_FORM_I18N,
  SETTINGS_ACCOUNT_CHANGE_EMAIL_I18N,
  SETTINGS_ACCOUNT_CHANGE_PASSWORD_I18N,
  SETTINGS_ACCOUNT_PERSONAL_DATA_I18N,
  SETTINGS_PAGE_ACCOUNT_I18N,
  SETTINGS_PAGE_APPEARANCE_I18N,
  SETTINGS_PAGE_DEVICES_I18N,
  SETTINGS_PAGE_FAQ_I18N,
  SETTINGS_PAGE_GENERAL_I18N,
  SETTINGS_PAGE_NOTIFICATIONS_I18N,
  SETTINGS_PAGE_ROADMAP_I18N,
  SETTINGS_PAGE_STORAGE_I18N,
  WAIT_EMAIL_CONFIRM_I18N,
  API_I18N,
  SOCKET_I18N,
  BROWSER_I18N,
  DB_QUOTA_I18N,
  TOAST_I18N,
  APP_CAPTCHA_I18N,
  CHAT_ROOM_CONTENT_I18N,
  CHAT_ROOMS_NAVIGATION_I18N,
  TOP_BAR_I18N
])

export const I18N_MESSAGES: ReturnType<typeof buildI18nMessages> = {
  en: {
    ...nmorphEn,
    ...appI18nMessages.en
  },
  ru: {
    ...nmorphRu,
    ...appI18nMessages.ru
  },
  zh: {
    ...nmorphZh,
    ...appI18nMessages.zh
  }
}
