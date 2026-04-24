import { AUTH_ENDPOINTS, ROUTE_NAMES } from 'global-shared'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useInfoNotification } from 'src/entities/info-notification'
import { useMedia } from 'src/entities/media-file'
import { useUserSession } from 'src/entities/user'
import { useApi } from 'src/shared/api'
import { LOCAL_STORAGE_KEY } from 'src/shared/config'
import { clearCookie, log } from 'src/shared/lib'

export const useLogout = () => {
  const router = useRouter()
  const { doRequest } = useApi()
  const { resetUserSession } = useUserSession()
  const chatRoomStore = useChatRoom()
  const contactStore = useContact()
  const infoNotificationStore = useInfoNotification()
  const mediaStore = useMedia()
  const isLogoutLoading = ref(false)

  const resetStores = async () => {
    await Promise.all([
      chatRoomStore.reset(),
      contactStore.reset(),
      infoNotificationStore.reset(),
      mediaStore.reset(),
      resetUserSession()
    ])
  }

  const resetClientSession = async () => {
    await resetStores()
    clearCookie()
    await router.push(ROUTE_NAMES.login)
  }

  const logout = async () => {
    isLogoutLoading.value = true

    try {
      await doRequest('post', AUTH_ENDPOINTS.logout)
      localStorage.removeItem(LOCAL_STORAGE_KEY.LogoutStatus)
    } catch (error) {
      localStorage.setItem(LOCAL_STORAGE_KEY.LogoutStatus, 'failed')
      log('error', 'Logout failed', error)
    } finally {
      await resetClientSession()
      isLogoutLoading.value = false
    }
  }

  return {
    isLogoutLoading,
    logout
  }
}
