import { nextTick, onMounted, ref } from 'vue'

import { useUser, useUserOnboarding } from 'src/entities/user'

import type { AppWelcomeDialogEmit } from '../config/types'

const isAppWelcomeVisible = ref(false)

export const useAppWelcome = () => {
  const { user } = useUser()

  const openAppWelcome = () => {
    isAppWelcomeVisible.value = true
  }

  const closeAppWelcome = () => {
    isAppWelcomeVisible.value = false
  }

  const initializeAppWelcome = () => {
    onMounted(async () => {
      await nextTick()

      if (!user.value.onboarding.welcomeCompleted) {
        openAppWelcome()
      }
    })
  }

  return {
    closeAppWelcome,
    initializeAppWelcome,
    isAppWelcomeVisible,
    openAppWelcome
  }
}

export const useAppWelcomeDialog = (emit: AppWelcomeDialogEmit) => {
  const { closeAppWelcome, initializeAppWelcome, isAppWelcomeVisible } = useAppWelcome()
  const { user } = useUser()
  const { updateUserOnboarding } = useUserOnboarding()

  const completeAppWelcome = async () => {
    if (!user.value.onboarding.welcomeCompleted) {
      await updateUserOnboarding({ welcomeCompleted: true })
    }

    closeAppWelcome()
    emit('complete')
  }

  const updateAppWelcomeVisible = async (isVisible: boolean) => {
    if (isVisible) {
      isAppWelcomeVisible.value = true
      return
    }

    completeAppWelcome()
  }

  initializeAppWelcome()

  return {
    completeAppWelcome,
    isAppWelcomeVisible,
    updateAppWelcomeVisible
  }
}
