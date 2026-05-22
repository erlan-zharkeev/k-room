import { AUTH_ENDPOINTS, ROUTE_NAMES } from 'global-shared'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useMedia } from 'src/entities/media-file'
import { useMessage } from 'src/entities/message'
import { useUser } from 'src/entities/user'
import { useHttp, socket } from 'src/shared/api'
import { clearCookie } from 'src/shared/lib'

import { LOCAL_STORAGE_KEY } from '../config/constants'

export const useLogout = () => {
  const router = useRouter()
  const { doHttpRequest } = useHttp()
  const { reset: resetChatRoom } = useChatRoom()
  const { reset: resetContact } = useContact()
  const { reset: resetKnownUser } = useKnownUser()
  const { reset: resetMedia } = useMedia()
  const { reset: resetMessage } = useMessage()
  const { reset: resetUser } = useUser()
  const isLogoutLoading = ref(false)

  const resetClientData = () =>
    Promise.all([resetChatRoom(), resetContact(), resetKnownUser(), resetMedia(), resetMessage(), resetUser()])

  const logout = async () => {
    isLogoutLoading.value = true

    try {
      await doHttpRequest('post', AUTH_ENDPOINTS.logout)
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
