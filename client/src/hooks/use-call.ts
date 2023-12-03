import { useContext, useRef } from 'react'
import { useDispatch } from 'react-redux'
import {
  initModalToCall,
  setCurrentCallAccepted,
  closeCallModal,
  markCurrentCallAsVideo,
  updateInterlocutorSettings
} from 'src/store/calls-slice'
import { AppDispatch } from 'src/store'
import Peer, { SignalData } from 'simple-peer'
import { Howl } from 'howler'
import {
  SocketActions,
  SocketActionsPayload,
  KRoomUser,
  NotificationType,
  NotificationMessage,
  BasicStreamSettings
} from 'common-types'
import { showNotification } from 'src/store/system-slice'
import { useTypedSelector } from '.'
import { RefsContext } from 'src/providers/RefsProvider'
import { $socket, $sound, Sounds, $clg } from 'src/services'

const emitCall = (userToCall: string, signal: SignalData, from: string, avatarPath: string, callerName: string) => {
  const payload: SocketActionsPayload['callUser'] = {
    userToCall,
    signal,
    from,
    avatarPath,
    callerName
  }
  $socket.emit(SocketActions.CALL_USER, payload)
}

const emitCallAnswer = (signal: SignalData, to: string, selfSocketId: string, callId: string) => {
  const payload: SocketActionsPayload['answerCall'] = {
    signal,
    to,
    selfSocketId,
    callId
  }
  $socket.emit(SocketActions.ANSWER_CALL, payload)
}

const emitUpdateSignal = (signal: SignalData) => {
  const payload: SocketActionsPayload['updateSignal'] = { signal }
  $socket.emit(SocketActions.UPDATE_CALL_SIGNAL, payload)
}

export const useCall = () => {
  const soundConnection = useRef<Howl>($sound(Sounds.connection, true))
  const soundCalling = useRef<Howl>($sound(Sounds.ring, true))
  const { settings } = useTypedSelector((state) => state.calls)
  const dispatch = useDispatch<AppDispatch>()
  const { interlocutorVideoDom, selfVideoDom } = useContext(RefsContext)
  const selfStream = useRef<MediaStream | null>(null)
  const interlocutorStream = useRef<MediaStream | null>(null)
  const connection = useRef<Peer.Instance | null>(null)
  const interlocutorId = useRef<string>('')
  const callerSignal = useRef<SignalData>()

  const getSelfStream = async (constraints: BasicStreamSettings) => {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints)
    } catch (error) {
      $clg('error', 'Failed to get device cause ' + String(error))
      dispatch(
        showNotification({
          message: NotificationMessage.failedToConnectToDevice,
          messageType: NotificationType.warn
        })
      )
    }
  }
  const applyStreamToHtmlVideoTag = (isSelf: boolean = true) => {
    const stream = isSelf ? selfStream.current : interlocutorStream.current
    const videoDomElement = isSelf ? selfVideoDom.current : interlocutorVideoDom.current
    try {
      videoDomElement.srcObject = stream
    } catch (e) {
      $clg('error', 'Failed to set stream tracks to HTMLElement' + String(e))
    }
  }

  const initConnection = (initiator: boolean, stream: MediaStream) => {
    connection.current = new Peer({ initiator, trickle: false, stream })
    connection.current.on('stream', (interlocutorMediaStream: MediaStream) => {
      interlocutorStream.current = interlocutorMediaStream
      interlocutorVideoDom.current.srcObject = interlocutorMediaStream
    })
    connection.current.on('error', (e) => {
      dispatch(showNotification({ messageType: NotificationType.error, message: NotificationMessage.unknownError }))
      $clg('error', 'An unknown error has occurred' + String(e))
    })
    connection.current.on('close', () => closeConnection())
    connection.current.on('data', (data: any) => {
      const responseData = JSON.parse(data)
      if (responseData.settings) dispatch(updateInterlocutorSettings(responseData.settings))
    })
  }

  const closeConnection = () => {
    dispatch(closeCallModal())
    soundConnection.current.stop()
    soundCalling.current.stop()
    dispatch(
      showNotification({
        message: NotificationMessage.callCompleted,
        messageType: NotificationType.info
      })
    )
    $socket.off(SocketActions.CALL_ACCEPTED)
    selfStream.current?.getTracks().forEach((track) => track.stop())
  }

  const initCall = async (interlocutorData: KRoomUser, selfId: string, selfAvatarPath: string, callerName: string) => {
    interlocutorId.current = interlocutorData.id
    const stream = await getSelfStream({ audio: settings.audio.value, video: settings.video.value })
    if (!stream) return
    selfStream.current = stream
    initConnection(true, selfStream.current)
    dispatch(initModalToCall(interlocutorData))
    soundConnection.current.play()
    connection.current?.on('signal', (data) => {
      if (connection.current?.connected) return emitUpdateSignal(data)
      emitCall(interlocutorData.id, data, selfId, selfAvatarPath, callerName)
    })
    $socket.on(SocketActions.CALL_ACCEPTED, (data: SocketActionsPayload['callAccepted']) => {
      soundConnection.current.stop()
      dispatch(setCurrentCallAccepted())
      connection.current?.signal(data.signal)
    })
  }

  const answerCall = async (callId: string) => {
    soundCalling.current.stop()
    dispatch(setCurrentCallAccepted())
    const stream = await getSelfStream({ audio: settings.audio.value, video: settings.video.value })
    if (!stream) return
    selfStream.current = stream
    initConnection(false, selfStream.current)
    connection.current?.on('signal', (data: SignalData) => {
      emitCallAnswer(data, interlocutorId.current, $socket.id, callId)
    })
    if (!callerSignal.current) return
    connection.current?.signal(callerSignal.current)
  }

  const calling = (callerId: string, callerSignalData: SignalData) => {
    soundCalling.current.play()
    interlocutorId.current = callerId
    callerSignal.current = callerSignalData
  }

  const updateCallerSignal = (signal: SignalData) => {
    callerSignal.current = signal
    connection.current?.signal(callerSignal.current)
  }

  const enableAudio = async ({ video }: { video: boolean }) => {
    const newStream = await getSelfStream({ audio: true, video })
    if (!newStream) return
    selfStream.current?.getAudioTracks().forEach((oldAudioTrack) => {
      const newAudioTrack = newStream.getAudioTracks()[0]
      if (!selfStream.current) return
      connection.current?.replaceTrack(oldAudioTrack, newAudioTrack, selfStream.current)
      selfStream.current.removeTrack(oldAudioTrack)
      selfStream.current.addTrack(newAudioTrack)
    })
    const data = { settings: { audio: true } }
    connection.current?.send(JSON.stringify(data))
  }

  const disableAudio = () => {
    if (!selfStream.current) return
    selfStream.current.getAudioTracks().forEach((audioTrack) => {
      audioTrack.stop()
    })
    const data = { settings: { audio: false } }
    connection.current?.send(JSON.stringify(data))
  }

  const enableVideo = async ({ callId, audio }: { callId: string; audio: boolean }) => {
    const newStream = await getSelfStream({ audio, video: true })
    if (!newStream) return
    const newVideoTrack = newStream.getVideoTracks()[0]
    const haveVideoStream = Boolean(selfStream.current?.getVideoTracks().length)
    const oldVideoTrack = selfStream.current?.getVideoTracks()[0]
    if (!selfStream.current) return
    selfStream.current.addTrack(newVideoTrack)
    if (haveVideoStream && oldVideoTrack) {
      connection.current?.replaceTrack(oldVideoTrack, newVideoTrack, selfStream.current)
      selfStream.current.removeTrack(oldVideoTrack)
    } else {
      connection.current?.addTrack(newVideoTrack, selfStream.current)
      applyStreamToHtmlVideoTag()
      dispatch(markCurrentCallAsVideo())
      const payload: SocketActionsPayload['markCallAsVideo'] = { callId }
      $socket.emit(SocketActions.MARK_CALL_AS_VIDEO, payload)
    }
    const data = { settings: { video: true } }
    connection.current?.send(JSON.stringify(data))
  }

  const disableVideo = () => {
    if (!selfStream.current) return
    selfStream.current.getVideoTracks().forEach((videoTrack) => {
      videoTrack.stop()
    })
    const data = { settings: { video: false } }
    connection.current?.send(JSON.stringify(data))
  }

  const leaveCall = (callId: string) => {
    try {
      connection.current?.destroy()
    } catch (e: any) {
      $clg('error', e)
    }
    closeConnection()
    if (!callId) return
    const payload: SocketActionsPayload['callEnded'] = {
      callerId: interlocutorId.current,
      callId
    }
    $socket.emit(SocketActions.CALL_ENDED, payload)
  }

  return {
    calling,
    leaveCall,
    answerCall,
    initCall,
    enableAudio,
    enableVideo,
    updateCallerSignal,
    disableVideo,
    disableAudio,
    applyStreamToHtmlVideoTag
  }
}
