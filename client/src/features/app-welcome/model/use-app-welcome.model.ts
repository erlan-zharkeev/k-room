import { computed, ref, watch } from 'vue'

import { useUser, useUserOnboarding } from 'src/entities/user'

import type { AppWelcomeDialogEmit, AppWelcomeDialogProps } from '../config/types'

const isAppWelcomeVisible = ref(false)

export const useAppWelcome = () => {
  const { isAuthorized, user } = useUser()

  const openAppWelcome = () => {
    isAppWelcomeVisible.value = true
  }

  const closeAppWelcome = () => {
    isAppWelcomeVisible.value = false
  }

  const initializeAppWelcome = () => {
    watch(
      () => ({
        isAuthorized: isAuthorized.value,
        welcomeCompleted: user.value.onboarding.welcomeCompleted
      }),
      ({ isAuthorized, welcomeCompleted }) => {
        if (!isAuthorized || welcomeCompleted) {
          closeAppWelcome()
          return
        }

        openAppWelcome()
      },
      { immediate: true }
    )
  }

  return {
    closeAppWelcome,
    initializeAppWelcome,
    isAppWelcomeVisible,
    openAppWelcome
  }
}

export const useAppWelcomeDialog = (props: AppWelcomeDialogProps, emit: AppWelcomeDialogEmit) => {
  const { closeAppWelcome, initializeAppWelcome, isAppWelcomeVisible } = useAppWelcome()
  const { user } = useUser()
  const { updateUserOnboarding } = useUserOnboarding()
  const dialogContentStyle = computed(() => ({ padding: props.padding }))

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
    dialogContentStyle,
    isAppWelcomeVisible,
    updateAppWelcomeVisible
  }
}
