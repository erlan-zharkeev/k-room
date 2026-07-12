import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const loadBrowserPushPermission = async (installed = true) => {
  const notifications = {
    browserPushPermissionPromptDismissed: false,
    calls: { browserPush: true },
    enabled: true,
    general: { browserPush: true },
    groupCalls: { browserPush: true },
    invites: { browserPush: true },
    messages: { browserPush: true }
  }
  const settings = ref({ notifications })
  const setByPath = vi.fn(async (_path: string, value: boolean) => {
    notifications.browserPushPermissionPromptDismissed = value
  })
  const requestPermission = vi.fn<() => Promise<NotificationPermission>>()
  const routerPush = vi.fn()

  Object.defineProperty(globalThis, 'Notification', {
    configurable: true,
    value: {
      permission: 'default',
      requestPermission
    }
  })

  vi.doMock('@vueuse/core', () => ({
    createGlobalState: (factory: () => unknown) => factory
  }))
  vi.doMock('vue-router', () => ({
    useRoute: () => ({ query: {} }),
    useRouter: () => ({ push: routerPush })
  }))
  vi.doMock('src/entities/setting', () => ({
    useSettings: () => ({ settings, setByPath })
  }))
  vi.doMock('src/shared/lib', () => ({
    captureClientSentryException: vi.fn(),
    defineI18n: (_namespace: string, values: Record<string, unknown>) =>
      Object.fromEntries(Object.keys(values).map((key) => [key, key])),
    isBrowserPushSupported: () => true,
    isInstalledPwa: () => installed,
    useScreen: () => ({ isPortraitTabletOrLess: ref(false) })
  }))

  const { useBrowserPushPermission } = await import('./use-browser-push-permission.model')

  return {
    requestPermission,
    setByPath,
    ...useBrowserPushPermission()
  }
}

describe('browser push permission dialog', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('opens only in an installed PWA', async () => {
    const browserTabPermission = await loadBrowserPushPermission(false)

    expect(browserTabPermission.openPendingBrowserPushPermissionDialog()).toBe(false)
    expect(browserTabPermission.isBrowserPushPermissionDialogVisible.value).toBe(false)

    vi.resetModules()
    const installedPwaPermission = await loadBrowserPushPermission()

    expect(installedPwaPermission.openPendingBrowserPushPermissionDialog()).toBe(true)
    expect(installedPwaPermission.isBrowserPushPermissionDialogVisible.value).toBe(true)
  })

  it('requests permission from the dialog action and closes after permission is granted', async () => {
    const permission = await loadBrowserPushPermission()
    permission.requestPermission.mockResolvedValue('granted')
    permission.openPendingBrowserPushPermissionDialog()

    await expect(permission.requestBrowserPushPermission()).resolves.toBe('granted')

    expect(permission.requestPermission).toHaveBeenCalledOnce()
    expect(permission.isBrowserPushPermissionDialogVisible.value).toBe(false)
  })

  it('remembers when the dialog is postponed', async () => {
    const permission = await loadBrowserPushPermission()
    permission.openPendingBrowserPushPermissionDialog()

    await permission.dismissBrowserPushPermissionDialog()

    expect(permission.setByPath).toHaveBeenCalledWith('notifications.browserPushPermissionPromptDismissed', true)
    expect(permission.isBrowserPushPermissionDialogVisible.value).toBe(false)
  })
})
