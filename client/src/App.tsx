import './styles/App.scss'
import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import AppRouter from 'src/router/AppRouter'
import { AppDispatch } from 'src/store'
import { ViewPort } from 'src/store/@types/SystemState'
import { getUserData } from 'src/store/userSlice'
import {
  setReconnectionAttempts,
  setViewPort,
  showNotification,
  socketConnect,
  socketDisconnect
} from 'src/store/systemSlice'
import getCookie from 'src/utils/getCookie'
import setTheme from 'src/utils/setTheme'
import { socket } from './socket/socket'
import { SocketActions, Message, User, ChatRoom as ChatRoomInterface } from 'common-types'
import $clg from './services/clg'
import { updateContactsStatus, loadContacts, updateContactData } from './store/contactsSlice'
import {
  updateChatUsersStatus,
  loadChatRooms,
  updateChatMessage,
  updateMessageStatus,
  changeChatName
} from './store/roomsSlice'
import _debounce from 'lodash/debounce'
import clearLocalStorageOnKeyDown from './utils/clearLocalStorageOnKeyDown'
import getViewPort from './utils/getViewPort'

function App(): JSX.Element {
  const { settings } = useTypedSelector((state) => state.persist.system)
  const { isAuth } = useTypedSelector((state) => state.auth)
  const userId = useTypedSelector((state) => state.auth.userData.id)

  const dispatch = useDispatch<AppDispatch>()
  const fetchUser = async () => await dispatch(getUserData({}))
  const handleResize = () => dispatch(setViewPort(getViewPort()))

  const statusNotification = (isSuccess: Boolean) => {
    if (isSuccess) {
      $clg('success', 'Socket connected')
      dispatch(showNotification({ messageType: 'success', message: 'Server socket connected!' }))
      return
    }
    $clg('error', 'Socket disconnected')
    if (isAuth) dispatch(showNotification({ messageType: 'error', message: 'Server socket disconnected!' }))
  }

  const debouncedStatusNotification = useCallback(_debounce(statusNotification, 3000), [])

  useEffect(() => {
    const accessToken = getCookie('jwt')
    if (accessToken) fetchUser()
    setTheme(settings.theme)
    const root = document.querySelector('body')
    root?.addEventListener('keydown', clearLocalStorageOnKeyDown)

    window.addEventListener('load', handleResize)
    window.addEventListener('resize', handleResize)

    socket.io.on(SocketActions.RECONNECTION, (attempt) => {
      $clg('success', `Socket reconnected on attempt: ${attempt}`)
      socket.emit(SocketActions.INITIALIZE, userId)
    })

    socket.io.on(SocketActions.RECONNECT_ATTEMPT, (attempt) => {
      $clg('warn', `Socket reconnecting. Attempt: ${attempt}`)
      dispatch(setReconnectionAttempts())
    })

    socket.on(SocketActions.CONNECTION, () => {
      dispatch(socketConnect())
      debouncedStatusNotification(true)
    })
    socket.on(SocketActions.DISCONNECT, () => {
      dispatch(socketDisconnect())
      debouncedStatusNotification(false)
    })
    socket.on(SocketActions.STATUS_CONTACT, (userData: { userId: string; status: boolean }) => {
      dispatch(updateContactsStatus(userData))
      dispatch(updateChatUsersStatus(userData))
    })
    socket.on(SocketActions.GET_ROOMS, (chatRooms: Array<ChatRoomInterface>) => {
      dispatch(loadChatRooms(chatRooms))
    })
    socket.on(SocketActions.MESSAGE_DELIVERED, (roomData: { roomId: string; message: Message }) => {
      console.log(socket)
      dispatch(updateChatMessage(roomData))
    })
    socket.on(
      SocketActions.UPDATE_MESSAGE_STATUS,
      (roomData: { roomId: string; messageId: string; status: string }) => {
        dispatch(updateMessageStatus(roomData))
      }
    )
    socket.on(SocketActions.GET_CONTACTS, (contacts: Array<User>, message?: string) => {
      if (message) dispatch(showNotification({ messageType: 'info', message }))
      dispatch(loadContacts(contacts))
    })
    socket.on(SocketActions.CHANGE_CONTACTS_DATA, (updatedUserData: User) => {
      dispatch(updateContactData(updatedUserData))
      dispatch(changeChatName(updatedUserData))
    })

    return () => {
      root?.removeEventListener('keydown', clearLocalStorageOnKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <AppRouter />
}

export default App
