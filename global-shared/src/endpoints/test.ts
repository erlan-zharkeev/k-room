import { describe, expect, it } from 'vitest'

import {
  APP_ROUTE_NAMES,
  APP_ROUTE_PATHS,
  CLIENT_RUNTIME_ENDPOINTS,
  ROUTE_NAMES,
  getAppCallPath,
  getAppChatRoomPath,
  getAppContactPath,
  getAppSettingsPath
} from '../index'

describe('endpoint contracts', () => {
  it('keeps auth routes and app routes stable', () => {
    expect(ROUTE_NAMES.authLogin).toBe('/authorize/login')
    expect(ROUTE_NAMES.authRegistration).toBe('/authorize/registration')
    expect(ROUTE_NAMES.app).toBe('/app')
    expect(ROUTE_NAMES.emailConfirmation).toBe('/page/email-confirmation')
    expect(ROUTE_NAMES.download).toBe('/download')
    expect(ROUTE_NAMES.pwaInstallAndroid).toBe('/pwa-install-android')
    expect(ROUTE_NAMES.pwaInstallIos).toBe('/pwa-install-ios')
    expect(ROUTE_NAMES.notification).toBe('/notification')
    expect(ROUTE_NAMES.notFound).toBe('/not-found')
    expect(CLIENT_RUNTIME_ENDPOINTS.getRuntimePolicy).toBe('/client/runtime-policy')
  })

  it('keeps app content routes stable', () => {
    expect(APP_ROUTE_NAMES.chatRooms).toBe('chat-rooms')
    expect(APP_ROUTE_NAMES.calls).toBe('calls')
    expect(APP_ROUTE_NAMES.contacts).toBe('contacts')
    expect(APP_ROUTE_NAMES.settings).toBe('settings')

    expect(APP_ROUTE_PATHS.chatRooms).toBe('/app/chat-rooms')
    expect(APP_ROUTE_PATHS.calls).toBe('/app/calls')
    expect(APP_ROUTE_PATHS.contacts).toBe('/app/contacts')
    expect(APP_ROUTE_PATHS.settings).toBe('/app/settings')

    expect(getAppChatRoomPath('room-id')).toBe('/app/chat-rooms/room-id')
    expect(getAppCallPath('room-id')).toBe('/app/calls/room-id')
    expect(getAppContactPath('room-id')).toBe('/app/contacts/room-id')
    expect(getAppSettingsPath('account')).toBe('/app/settings/account')
  })
})
