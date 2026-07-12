import { nextTick, onMounted } from 'vue'

import { useUser } from 'src/entities/user'
import { type BrowserPushPermissionDialogResult, useBrowserPushPermission } from 'src/features/browser-push-permission'
import { useOnboardingGuide } from 'src/features/onboarding-guide'

export const useAppOnboarding = (syncWebPushSubscription: () => Promise<void>) => {
  const { user } = useUser()
  const { openPendingBrowserPushPermissionDialog } = useBrowserPushPermission()
  const { openPendingGuide } = useOnboardingGuide()

  const continueAppOnboarding = () => {
    if (openPendingBrowserPushPermissionDialog()) return

    openPendingGuide()
  }

  const completeBrowserPushPermissionDialog = async (result: BrowserPushPermissionDialogResult) => {
    if (result !== 'enabled') return

    await syncWebPushSubscription()
    openPendingGuide()
  }

  onMounted(async () => {
    await nextTick()

    if (user.value.onboarding.welcomeCompleted) {
      continueAppOnboarding()
    }
  })

  return {
    completeBrowserPushPermissionDialog,
    continueAppOnboarding
  }
}
