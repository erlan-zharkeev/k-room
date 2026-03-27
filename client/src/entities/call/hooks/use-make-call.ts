import { useContext, useRef } from 'react'

import {
  SocketActionsType,
  IFrontendUserData,
  IBasicStreamSettings,
  IEventCallUser,
  IEventAnswerCall,
  IEventUpdateSignal,
  IEventCallAccepted,
  IEventMarkCallAsVideo,
  IEventCallEnded
} from 'common'
import { useDispatch } from 'react-redux'
import Peer, { SignalData } from 'simple-peer'

import { AppDispatchType } from 'src/app/store'

import {
  updateInterlocutorSettings,
  closeCallModal,
  initModalToCall,
  setCurrentCallAccepted,
  markCurrentCallAsVideo
} from 'src/entities/call'
import { NOTIFICATION_MESSAGE, useNotification } from 'src/entities/notification'

import { socket } from 'src/shared/api'
import { frontCaptureSentryException, useTypedSelector } from 'src/shared/lib'
import { RefsContext } from 'src/shared/providers'
import { clg } from 'src/shared/utils'

const parsePeerData = (data: unknown) => {
  if (typeof data === 'string') return JSON.parse(data) as { settings?: { audio?: boolean; video?: boolean } }
  if (data instanceof Uint8Array) {
    return JSON.parse(new TextDecoder().decode(data)) as { settings?: { audio?: boolean; video?: boolean } }
  }
  if (data instanceof ArrayBuffer) {
    return JSON.parse(new TextDecoder().decode(new Uint8Array(data))) as {
      settings?: { audio?: boolean; video?: boolean }
    }
  }

  return null
}

const emitCall = (userToCall: string, signal: SignalData, from: string, avatar: string, callerName: string) => {
  const payload: IEventCallUser = {
    userToCall,
    signal,
    from,
    avatar,
    callerName
  }
  socket.emit<SocketActionsType>('call-user', payload)
}

const emitCallAnswer = (signal: SignalData, to: string, selfSocketId: string, callId: string) => {
  const payload: IEventAnswerCall = {
    signal,
    to,
    selfSocketId,
    callId
  }
  socket.emit<SocketActionsType>('answer-call', payload)
}

const emitUpdateSignal = (signal: SignalData) => {
  const payload: IEventUpdateSignal = { signal }
  socket.emit<SocketActionsType>('update-call-signal', payload)
}

export const useMakeCall = () => {
  // const soundConnection = useRef<Howl>(useSound('connection', true))
  // const soundCalling = useRef<Howl>(useSound('ring', true))
  const { settings } = useTypedSelector((state) => state.calls)
  const dispatch = useDispatch<AppDispatchType>()

  const { interlocutorVideoDom, selfVideoDom } = useContext(RefsContext)

  const selfStream = useRef<MediaStream | null>(null)
  const interlocutorStream = useRef<MediaStream | null>(null)
  const connection = useRef<Peer.Instance | null>(null)
  const interlocutorId = useRef<string>('')
  const callerSignal = useRef<SignalData>()

  const notifications = useNotification()

  const failedToConnectToDeviceNotification = notifications.getNotification({
    message: NOTIFICATION_MESSAGE.failedToConnectToDevice(),
    messageType: 'error'
  })

  const getSelfStream = async (constraints: IBasicStreamSettings) => {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints)
    } catch (error) {
      clg('error', 'Failed to get device cause ' + String(error))
      failedToConnectToDeviceNotification.open()
      return null
    }
  }
  const applyStreamToHtmlVideoTag = (isSelf: boolean = true) => {
    const stream = isSelf ? selfStream.current : interlocutorStream.current
    const videoDomElement = isSelf ? selfVideoDom.current : interlocutorVideoDom.current
    if (!videoDomElement) return
    try {
      videoDomElement.srcObject = stream
    } catch (error) {
      clg('error', 'Failed to set stream tracks to HTMLElement' + String(error))
      frontCaptureSentryException(error)
    }
  }

  const initConnection = (initiator: boolean, stream: MediaStream) => {
    connection.current = new Peer({ initiator, trickle: false, stream })
    connection.current.on('stream', (interlocutorMediaStream: MediaStream) => {
      interlocutorStream.current = interlocutorMediaStream
      if (!interlocutorVideoDom.current) return
      interlocutorVideoDom.current.srcObject = interlocutorMediaStream
    })
    connection.current.on('error', (e) => {
      clg('error', 'An unknown error has occurred' + String(e))
      frontCaptureSentryException(e)
    })
    connection.current.on('close', () => closeConnection())
    connection.current.on('data', (data: unknown) => {
      const responseData = parsePeerData(data)
      if (!responseData) return
      if (responseData.settings) dispatch(updateInterlocutorSettings(responseData.settings))
    })
  }

  const callCompletedNotification = notifications.getNotification({
    message: NOTIFICATION_MESSAGE.callCompleted(),
    messageType: 'info'
  })

  const closeConnection = (silent = false) => {
    dispatch(closeCallModal())
    // soundConnection.current.stop()
    // soundCalling.current.stop()
    if (!silent) {
      callCompletedNotification.open()
    }
    socket.off('call-accepted')
    selfStream.current?.getTracks().forEach((track) => {
      track.stop()
    })
  }

  const initCall = async (
    interlocutorData: IFrontendUserData,
    selfId: string,
    selfAvatarPath: string,
    callerName: string
  ) => {
    interlocutorId.current = interlocutorData.id
    const stream = await getSelfStream({ audio: settings.audio.value, video: settings.video.value })
    if (!stream) return
    selfStream.current = stream
    initConnection(true, selfStream.current)
    dispatch(initModalToCall(interlocutorData))
    // soundConnection.current.play()
    connection.current?.on('signal', (data) => {
      if (connection.current?.connected) return emitUpdateSignal(data)
      emitCall(interlocutorData.id, data, selfId, selfAvatarPath, callerName)
    })
    socket.on<SocketActionsType>('call-accepted', (data: IEventCallAccepted) => {
      // soundConnection.current.stop()
      dispatch(setCurrentCallAccepted())
      connection.current?.signal(data.signal as SignalData)
    })
  }

  const answerCall = async (callId: string) => {
    // soundCalling.current.stop()
    const stream = await getSelfStream({ audio: settings.audio.value, video: settings.video.value })
    if (!stream) {
      leaveCall(callId)
      return
    }
    dispatch(setCurrentCallAccepted())
    selfStream.current = stream
    initConnection(false, selfStream.current)
    connection.current?.on('signal', (data: SignalData) => {
      if (!socket.id) return
      emitCallAnswer(data, interlocutorId.current, socket.id, callId)
    })
    if (!callerSignal.current) return
    connection.current?.signal(callerSignal.current)
  }

  const calling = (callerId: string, callerSignalData: SignalData) => {
    // soundCalling.current.play()
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
      const payload: IEventMarkCallAsVideo = { callId }
      socket.emit<SocketActionsType>('mark-call-as-video', payload)
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
    } catch (error: unknown) {
      if (error instanceof Error) clg('error', error.message)
      frontCaptureSentryException(error)
    }
    closeConnection(true)
    if (!callId) return
    const payload: IEventCallEnded = {
      callerId: interlocutorId.current,
      callId
    }
    socket.emit<SocketActionsType>('call-ended', payload)
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
    applyStreamToHtmlVideoTag,
    closeConnection
  }
}
