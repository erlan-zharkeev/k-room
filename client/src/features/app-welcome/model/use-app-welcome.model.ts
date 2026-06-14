import { nextTick, onMounted, ref } from 'vue'

import type { AppWelcomeDialogEmit } from '../config/types'

const isAppWelcomeVisible = ref(false)

export const useAppWelcome = () => {
  const openAppWelcome = () => {
    isAppWelcomeVisible.value = true
  }

  const closeAppWelcome = () => {
    isAppWelcomeVisible.value = false
  }

  const initializeAppWelcome = () => {
    onMounted(async () => {
      await nextTick()
      openAppWelcome()
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

  const completeAppWelcome = () => {
    closeAppWelcome()
    emit('complete')
  }

  const updateAppWelcomeVisible = (isVisible: boolean) => {
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
