import { ROUTE_NAMES } from 'global-shared'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const usePageBackButton = () => {
  const route = useRoute()
  const router = useRouter()
  const fallbackRoute = computed(() => (route.meta.guestOnly ? ROUTE_NAMES.authLogin : ROUTE_NAMES.app))

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.replace(fallbackRoute.value)
  }

  return {
    handleBack
  }
}
