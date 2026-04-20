import { useState } from 'react'

import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { AUTH_ENDPOINTS, ROUTE_NAMES } from 'common'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useInfoNotification } from 'src/entities/info-notification'
import { useMedia } from 'src/entities/media-file'
import { useUser } from 'src/entities/user'

import { socket, useApi } from 'src/shared/api'
import { LOCAL_STORAGE_KEY } from 'src/shared/config'
import { clearCookie } from 'src/shared/lib'
import { resetSystemStore, setAuth } from 'src/shared/system'

export const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { doRequest } = useApi()
  const userStore = useUser()
  const contactStore = useContact()
  const infoNotificationStore = useInfoNotification()
  const mediaStore = useMedia()
  const chatRoomStore = useChatRoom()

  const resetStores = () => {
    contactStore.reset()
    infoNotificationStore.reset()
    mediaStore.reset()
    chatRoomStore.reset()
    userStore.reset()
    dispatch(resetSystemStore())
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await doRequest('post', AUTH_ENDPOINTS.logout)
      localStorage.removeItem(LOCAL_STORAGE_KEY.LogoutStatus)
    } catch {
      localStorage.setItem(LOCAL_STORAGE_KEY.LogoutStatus, 'failed')
    } finally {
      dispatch(setAuth('unauthorized'))
      clearCookie()
      resetStores()
      socket.disconnect()
      navigate(ROUTE_NAMES.login)
      setIsLoading(false)
    }
  }

  return { logout, isLoading }
}
