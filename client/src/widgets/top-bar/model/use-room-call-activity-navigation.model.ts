import { useRoute, useRouter } from 'vue-router'

import { APP_PAGE_ROUTES } from 'src/features/app-navigation'

export const useRoomCallActivityNavigation = () => {
  const route = useRoute()
  const router = useRouter()

  const openRoomCall = (roomId: string) =>
    router.push({
      path: `${APP_PAGE_ROUTES.chatRooms}/${roomId}`,
      query: {
        ...route.query,
        view: 'content'
      }
    })

  return {
    openRoomCall
  }
}
