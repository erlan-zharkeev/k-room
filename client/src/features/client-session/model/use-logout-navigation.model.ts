import { readonly, ref } from 'vue'

const isLogoutNavigationActive = ref(false)

export const useLogoutNavigation = () => {
  const startLogoutNavigation = () => {
    isLogoutNavigationActive.value = true
  }

  const stopLogoutNavigation = () => {
    isLogoutNavigationActive.value = false
  }

  return {
    isLogoutNavigationActive: readonly(isLogoutNavigationActive),
    startLogoutNavigation,
    stopLogoutNavigation
  }
}
