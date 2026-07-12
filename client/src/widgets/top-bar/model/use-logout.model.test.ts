import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  blockAuthRefresh: vi.fn(),
  blockMediaSync: vi.fn(),
  clearCookie: vi.fn(),
  clearLogoutStatus: vi.fn(),
  clearNativeAuthSession: vi.fn(),
  disconnectSocket: vi.fn(),
  doHttpRequest: vi.fn(),
  markLogoutFailed: vi.fn(),
  navigateToLogin: vi.fn(),
  resetChatRoom: vi.fn(),
  resetContact: vi.fn(),
  resetKnownUser: vi.fn(),
  resetMedia: vi.fn(),
  resetMessage: vi.fn(),
  resetRoomCall: vi.fn(),
  resetUser: vi.fn(),
  startLogoutNavigation: vi.fn(),
  stopLogoutNavigation: vi.fn(),
  stopSocketDataLoading: vi.fn(),
  syncAppBadge: vi.fn()
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mocks.navigateToLogin })
}))
vi.mock('src/entities/chat-room', () => ({ useChatRoom: () => ({ reset: mocks.resetChatRoom }) }))
vi.mock('src/entities/contact', () => ({ useContact: () => ({ reset: mocks.resetContact }) }))
vi.mock('src/entities/known-user', () => ({ useKnownUser: () => ({ reset: mocks.resetKnownUser }) }))
vi.mock('src/entities/media-file', () => ({
  blockMediaSync: mocks.blockMediaSync,
  useMedia: () => ({ reset: mocks.resetMedia })
}))
vi.mock('src/entities/message', () => ({ useMessage: () => ({ reset: mocks.resetMessage }) }))
vi.mock('src/entities/room-call', () => ({ useRoomCall: () => ({ reset: mocks.resetRoomCall }) }))
vi.mock('src/entities/user', () => ({ useUser: () => ({ reset: mocks.resetUser }) }))
vi.mock('src/features/client-session', () => ({
  useClientLogoutStatus: () => ({
    clearLogoutStatus: mocks.clearLogoutStatus,
    markLogoutFailed: mocks.markLogoutFailed
  }),
  useLogoutNavigation: () => ({
    startLogoutNavigation: mocks.startLogoutNavigation,
    stopLogoutNavigation: mocks.stopLogoutNavigation
  })
}))
vi.mock('src/shared/api', () => ({
  blockAuthRefresh: mocks.blockAuthRefresh,
  clearNativeAuthSession: mocks.clearNativeAuthSession,
  socket: { disconnect: mocks.disconnectSocket },
  stopSocketDataLoading: mocks.stopSocketDataLoading,
  useHttp: () => ({ doHttpRequest: mocks.doHttpRequest })
}))
vi.mock('src/shared/lib', () => ({
  clearCookie: mocks.clearCookie,
  log: vi.fn(),
  syncAppBadge: mocks.syncAppBadge
}))

const { useLogout } = await import('./use-logout.model')

describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.doHttpRequest.mockResolvedValue(undefined)
    mocks.navigateToLogin.mockResolvedValue(undefined)
    mocks.syncAppBadge.mockResolvedValue(undefined)
  })

  it('redirects to login before clearing client session data', async () => {
    const { isLogoutLoading, logout } = useLogout()

    await logout()

    const navigationOrder = mocks.navigateToLogin.mock.invocationCallOrder[0]
    const cleanupMocks = [
      mocks.clearCookie,
      mocks.clearNativeAuthSession,
      mocks.disconnectSocket,
      mocks.stopSocketDataLoading,
      mocks.syncAppBadge,
      mocks.resetChatRoom,
      mocks.resetContact,
      mocks.resetKnownUser,
      mocks.resetMedia,
      mocks.resetMessage,
      mocks.resetRoomCall,
      mocks.resetUser
    ]

    expect(mocks.doHttpRequest.mock.invocationCallOrder[0]).toBeLessThan(navigationOrder)
    cleanupMocks.forEach((cleanupMock) => {
      expect(navigationOrder).toBeLessThan(cleanupMock.mock.invocationCallOrder[0])
    })
    expect(mocks.clearLogoutStatus).toHaveBeenCalledOnce()
    expect(mocks.markLogoutFailed).not.toHaveBeenCalled()
    expect(isLogoutLoading.value).toBe(false)
  })

  it('still redirects and clears client data when server logout fails', async () => {
    mocks.doHttpRequest.mockRejectedValueOnce(new Error('logout failed'))
    const { logout } = useLogout()

    await logout()

    expect(mocks.markLogoutFailed).toHaveBeenCalledOnce()
    expect(mocks.navigateToLogin).toHaveBeenCalledOnce()
    expect(mocks.resetUser).toHaveBeenCalledOnce()
  })
})
