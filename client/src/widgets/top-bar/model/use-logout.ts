import { AUTH_ENDPOINTS, ROUTE_NAMES } from 'global-shared'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useInfoNotification } from 'src/entities/info-notification'
import { useMedia } from 'src/entities/media-file'
import { useUser } from 'src/entities/user'
import { useApi, socket } from 'src/shared/api'
import { LOCAL_STORAGE_KEY } from 'src/shared/config'
import { clearCookie } from 'src/shared/lib'

export const useLogout = () => {
  const router = useRouter()
  const { doRequest } = useApi()
  const { reset: resetChatRoom } = useChatRoom()
  const { reset: resetContact } = useContact()
  const { reset: resetInfoNotification } = useInfoNotification()
  const { reset: resetMedia } = useMedia()
  const { reset: resetUser } = useUser()
  const isLogoutLoading = ref(false)

  const resetClientData = () =>
    Promise.all([resetChatRoom(), resetContact(), resetInfoNotification(), resetMedia(), resetUser()])

  const logout = async () => {
    isLogoutLoading.value = true

    try {
      await doRequest('post', AUTH_ENDPOINTS.logout)
      localStorage.removeItem(LOCAL_STORAGE_KEY.LogoutStatus)
    } catch {
      localStorage.setItem(LOCAL_STORAGE_KEY.LogoutStatus, 'failed')
    } finally {
      await resetClientData()
      clearCookie()
      socket.disconnect()
      await router.push(ROUTE_NAMES.authLogin)
      isLogoutLoading.value = false
    }
  }

  return {
    isLogoutLoading,
    logout
  }
}
