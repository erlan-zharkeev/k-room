import { useContext, useRef } from 'react'
import { useDispatch } from 'react-redux'
import {
  initModalToCall,
  setCurrentCallAccepted,
  updateInterlocutorSettings,
  closeCallModal
} from 'src/store/callsSlice'
import { AppDispatch } from 'src/store'
import Peer, { SignalData } from 'simple-peer'
import { Howl } from 'howler'
import $clg from 'src/services/$clg'
import $sound, { Sounds } from 'src/services/$sound'
import { socket } from 'src/socket/socket'
import { SocketActions, SocketActionsPayload, User, UserMediaType, NotificationType } from 'common-types'
import useTypedSelector from './useTypedSelector'
import { showNotification } from 'src/store/systemSlice'
import { RefsContext } from 'src/providers/RefsProvider'

interface ConnectionOptions {
  initiator: boolean
  trickle: boolean
  stream: MediaStream
}

const useCall = () => {
  const { interlocutorVideoDom, selfVideoDom } = useContext(RefsContext)
  const dispatch = useDispatch<AppDispatch>()

  const { audio, video } = useTypedSelector((state) => state.calls.settings)
  const selfStream = useRef<MediaStream | null>(null)

  const interlocutorId = useRef<string>('')
  const interlocutorStream = useRef<MediaStream | null>(null)

  const soundConnection = useRef<Howl>($sound(Sounds.connection, true))
  const soundCalling = useRef<Howl>($sound(Sounds.ring, true))

  const connection = useRef<Peer.Instance>()
  const callerSignal = useRef<SignalData>()

  const listenConnectionError = () => {
    if (!connection.current) return
    connection.current.on('error', (e: any) => {
      dispatch(showNotification({ messageType: NotificationType.error, message: 'An unknown error has occurred' }))
      $clg('error', 'An unknown error has occurred' + String(e))
    })
  }

  const initConnection = (options: ConnectionOptions) => {
    connection.current = new Peer(options)
  }

  const initCall = async (interlocutorData: User, selfId: string, selfAvatarPath: string, callerName: string) => {
    interlocutorId.current = interlocutorData.id
    dispatch(initModalToCall(interlocutorData))
    // soundConnection.current.play()
    selfStream.current = await navigator.mediaDevices.getUserMedia({ audio, video })
    initConnection({
      initiator: true,
      trickle: false,
      stream: selfStream.current
    })
    listenConnectionError()
    if (!connection.current) return

    connection.current.on('signal', (data: SignalData) => {
      const payload: SocketActionsPayload['callUser'] = {
        userToCall: interlocutorData.id,
        signal: data,
        from: selfId,
        avatarPath: selfAvatarPath,
        callerName,
        settings: {
          audio,
          video
        }
      }
      socket.emit(SocketActions.CALL_USER, payload)
    })

    connection.current.on('stream', (interlocutorMediaStream: MediaStream) => {
      interlocutorStream.current = interlocutorMediaStream
    })

    connection.current.on('close', () => {
      dispatch(
        showNotification({
          message: 'Call completed',
          messageType: NotificationType.info
        })
      )
      socket.off(SocketActions.CALL_ACCEPTED)
    })

    socket.on(SocketActions.CALL_ACCEPTED, (data: SocketActionsPayload['callAccepted']) => {
      // soundConnection.current.stop()
      dispatch(setCurrentCallAccepted())
      dispatch(updateInterlocutorSettings(data.settings))
      if (!connection.current) return
      connection.current.signal(data.signal)
    })
  }

  // ---------

  const answerCall = (callId: string) => {
    // soundCalling.current.stop()
    dispatch(setCurrentCallAccepted())
    if (!selfStream.current) {
      dispatch(showNotification({ messageType: NotificationType.error, message: 'Failed to get self stream' }))
      return
    }
    initConnection({
      initiator: false,
      trickle: false,
      stream: selfStream.current
    })

    listenConnectionError()
    if (!connection.current) return

    connection.current.on('signal', (data) => {
      const payload: SocketActionsPayload['answerCall'] = {
        signal: data,
        to: interlocutorId.current,
        settings: { audio, video },
        selfSocketId: socket.id,
        callId
      }
      socket.emit(SocketActions.ANSWER_CALL, payload)
    })
    connection.current.on('stream', (interlocutorMediaStream: MediaStream) => {
      interlocutorStream.current = interlocutorMediaStream
      interlocutorVideoDom.current.srcObject = interlocutorStream.current
    })
    connection.current.on('close', () => {
      dispatch(
        showNotification({
          message: 'Call completed',
          messageType: NotificationType.info
        })
      )
      socket.off(SocketActions.ANSWER_CALL)
    })
    if (!callerSignal.current) {
      dispatch(
        showNotification({
          message: 'Cannot set caller signal',
          messageType: NotificationType.error
        })
      )
      return
    }
    connection.current.signal(callerSignal.current)
  }

  // -----

  const calling = (callerId: string, callerSignalData: SignalData) => {
    // soundCalling.current.play()
    interlocutorId.current = callerId
    callerSignal.current = callerSignalData
  }

  // -----

  const setStream = async () => {
    try {
      selfStream.current = await navigator.mediaDevices.getUserMedia({ audio, video })
      selfVideoDom.current.srcObject = selfStream.current
    } catch (error) {
      $clg('error', 'Failed to get device cause ' + String(error))
      dispatch(
        showNotification({
          message: 'Failed to connect to device, check for device is plugged in',
          messageType: NotificationType.warn
        })
      )
    }
    return Boolean(selfStream.current)
  }

  // -----

  const toggleSetting = (type: UserMediaType) => {
    const isVideo = type === UserMediaType.video
    const tracks = isVideo ? 'getVideoTracks' : 'getAudioTracks'
    const value = type === UserMediaType.audio ? audio : video
    if (!selfStream.current) {
      $clg('error', 'Failed to get self stream')
      return
    }
    if (value) setStream()
    else selfStream.current[tracks]().forEach((track) => track.stop())
    const payload: SocketActionsPayload['changeCallSettings'] = { audio, video }
    socket.emit(SocketActions.CHANGE_CALL_SETTINGS, payload)
  }

  // ------

  const leaveCall = (callId: string) => {
    // soundCalling.current.stop()
    const payload: SocketActionsPayload['callEnded'] = {
      callerId: interlocutorId.current,
      callId
    }
    socket.emit(SocketActions.CALL_ENDED, payload)
    dispatch(closeCallModal())
    if (selfStream.current) {
      const tracks = selfStream.current.getTracks()
      tracks.forEach((track) => {
        track.stop()
      })
    }
    if (connection.current) {
      connection.current.destroy()
    }
  }

  return {
    calling,
    leaveCall,
    answerCall,
    toggleSetting,
    initCall,
    setStream,
    interlocutorId
  }
}

export default useCall
