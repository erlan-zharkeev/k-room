import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const onboardingMocks = vi.hoisted(() => ({
  openPendingBrowserPushPermissionDialog: vi.fn(),
  openPendingGuide: vi.fn()
}))

vi.mock('vue', async (importOriginal) => {
  const vue = await importOriginal<typeof import('vue')>()

  return {
    ...vue,
    onMounted: vi.fn()
  }
})
vi.mock('src/entities/user', () => ({
  useUser: () => ({ user: ref({ onboarding: { welcomeCompleted: true } }) })
}))
vi.mock('src/features/browser-push-permission', () => ({
  useBrowserPushPermission: () => ({
    openPendingBrowserPushPermissionDialog: onboardingMocks.openPendingBrowserPushPermissionDialog
  })
}))
vi.mock('src/features/onboarding-guide', () => ({
  useOnboardingGuide: () => ({
    openPendingGuide: onboardingMocks.openPendingGuide
  })
}))

const { useAppOnboarding } = await import('./use-app-onboarding.model')

describe('app onboarding sequence', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('waits for browser push permission before opening the guide', () => {
    onboardingMocks.openPendingBrowserPushPermissionDialog.mockReturnValue(true)
    const { continueAppOnboarding } = useAppOnboarding(vi.fn())

    continueAppOnboarding()

    expect(onboardingMocks.openPendingGuide).not.toHaveBeenCalled()
  })

  it('opens the guide when the permission dialog is not pending', () => {
    onboardingMocks.openPendingBrowserPushPermissionDialog.mockReturnValue(false)
    const { continueAppOnboarding } = useAppOnboarding(vi.fn())

    continueAppOnboarding()

    expect(onboardingMocks.openPendingGuide).toHaveBeenCalledOnce()
  })

  it('syncs the subscription before continuing after permission is granted', async () => {
    const syncWebPushSubscription = vi.fn()
    const { completeBrowserPushPermissionDialog } = useAppOnboarding(syncWebPushSubscription)

    await completeBrowserPushPermissionDialog('enabled')

    expect(syncWebPushSubscription).toHaveBeenCalledOnce()
    expect(onboardingMocks.openPendingGuide).toHaveBeenCalledOnce()
  })

  it.each(['later', 'settings'] as const)('does not open the guide after %s', async (result) => {
    const { completeBrowserPushPermissionDialog } = useAppOnboarding(vi.fn())

    await completeBrowserPushPermissionDialog(result)

    expect(onboardingMocks.openPendingGuide).not.toHaveBeenCalled()
  })
})
