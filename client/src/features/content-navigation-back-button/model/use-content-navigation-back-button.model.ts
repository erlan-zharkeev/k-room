import { useRoute, useRouter } from 'vue-router'

export const useContentNavigationBackButton = () => {
  const route = useRoute()
  const router = useRouter()

  const navigateToContentNavigation = () => {
    router.replace({ query: { ...route.query, view: 'content-navigation' } })
  }

  return {
    navigateToContentNavigation
  }
}
