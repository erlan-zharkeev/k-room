import { getAppChatRoomPath } from 'global-shared'
import { useRoute, useRouter } from 'vue-router'

export const useRoomCallActivityNavigation = () => {
  const route = useRoute()
  const router = useRouter()

  const openRoomCall = (roomId: string) =>
    router.push({
      path: getAppChatRoomPath(roomId),
      query: {
        ...route.query,
        view: 'content'
      }
    })

  return {
    openRoomCall
  }
}
