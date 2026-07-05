import { getAppChatRoomPath } from 'global-shared'
import { useRoute, useRouter } from 'vue-router'

import { waitNextFrame } from 'src/shared/lib'
import { runClientUiTask } from 'src/shared/model'

export const useRoomCallActivityNavigation = () => {
  const route = useRoute()
  const router = useRouter()

  const openRoomCall = async (roomId: string) => {
    await runClientUiTask('room-call-activity:open-room', async () => {
      await waitNextFrame()
      await router.push({
        path: getAppChatRoomPath(roomId),
        query: {
          ...route.query,
          view: 'content'
        }
      })
    })
  }

  return {
    openRoomCall
  }
}
