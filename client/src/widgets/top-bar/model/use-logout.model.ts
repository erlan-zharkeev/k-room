import { AUTH_ENDPOINTS, ROUTE_NAMES } from 'global-shared'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { blockMediaSync, useMedia } from 'src/entities/media-file'
import { useMessage } from 'src/entities/message'
import { useRoomCall } from 'src/entities/room-call'
import { useUser } from 'src/entities/user'
import { useClientLogoutStatus, useLogoutNavigation } from 'src/features/client-session'
import { blockAuthRefresh, clearNativeAuthSession, socket, stopSocketDataLoading, useHttp } from 'src/shared/api'
import { clearCookie, log, syncAppBadge } from 'src/shared/lib'

export const useLogout = () => {
  const router = useRouter()
  const { doHttpRequest } = useHttp()
  const { reset: resetChatRoom } = useChatRoom()
  const { reset: resetContact } = useContact()
  const { reset: resetKnownUser } = useKnownUser()
  const { reset: resetMedia } = useMedia()
  const { reset: resetMessage } = useMessage()
  const { reset: resetRoomCall } = useRoomCall()
  const { reset: resetUser } = useUser()
  const { startLogoutNavigation, stopLogoutNavigation } = useLogoutNavigation()
  const { clearLogoutStatus, markLogoutFailed } = useClientLogoutStatus()
  const isLogoutLoading = ref(false)

  const resetClientData = () =>
    Promise.all([
      resetChatRoom(),
      resetContact(),
      resetKnownUser(),
      resetMedia(),
      resetMessage(),
      resetRoomCall(),
      resetUser()
    ])

  const navigateToLogin = async () => {
    startLogoutNavigation()

    try {
      await router.push(ROUTE_NAMES.authLogin)
    } catch (error) {
      log('error', 'Logout navigation failed', error)
    } finally {
      stopLogoutNavigation()
    }
  }

  const clearClientSession = async () => {
    try {
      await resetClientData()
    } catch (error) {
      log('error', 'Logout client data reset failed', error)
    }
  }

  const logout = async () => {
    isLogoutLoading.value = true
    blockAuthRefresh()
    blockMediaSync()

    try {
      await doHttpRequest('post', AUTH_ENDPOINTS.logout, {}, { showErrorToast: false })
      clearLogoutStatus()
    } catch {
      markLogoutFailed()
    } finally {
      try {
        await navigateToLogin()
        clearCookie()
        clearNativeAuthSession()
        socket.disconnect()
        stopSocketDataLoading()
        await syncAppBadge(0)
        await clearClientSession()
      } finally {
        isLogoutLoading.value = false
      }
    }
  }

  return {
    isLogoutLoading,
    logout
  }
}
