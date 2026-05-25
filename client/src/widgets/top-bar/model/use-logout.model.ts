import { useLocalStorage } from '@vueuse/core'
import { AUTH_ENDPOINTS, ROUTE_NAMES } from 'global-shared'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { blockMediaSync, useMedia } from 'src/entities/media-file'
import { useMessage } from 'src/entities/message'
import { useUser } from 'src/entities/user'
import { blockAuthRefresh, useHttp, socket } from 'src/shared/api'
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
  const logoutStatus = useLocalStorage<string | null>(LOCAL_STORAGE_KEY.LogoutStatus, null)

  const resetClientData = () =>
    Promise.all([resetChatRoom(), resetContact(), resetKnownUser(), resetMedia(), resetMessage(), resetUser()])

  const logout = async () => {
    isLogoutLoading.value = true
    blockAuthRefresh()
    blockMediaSync()

    try {
      await doHttpRequest('post', AUTH_ENDPOINTS.logout)
      logoutStatus.value = null
    } catch {
      logoutStatus.value = 'failed'
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
