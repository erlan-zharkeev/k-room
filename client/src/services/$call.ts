import { User, SocketActions } from 'common-types'
import { Howl } from 'howler'
import Peer, { SignalData } from 'simple-peer'
import { Socket } from 'socket.io-client'
import $clg from 'src/services/$clg'
import $sound, { Sounds } from 'src/services/$sound'
import { socket } from 'src/socket/socket'
import { AppDispatch } from 'src/store'
import {
  closeCallModal,
  initModalToCall,
  setCurrentCallAccepted,
  updateInterlocutorSettings
} from 'src/store/callsSlice'
import { store } from 'src/store/index'
import { showNotification } from 'src/store/systemSlice'

class Call {
  selfId!: string
  dispatch: AppDispatch
  selfStream!: MediaStream
  interlocutorStream!: MediaStream
  connection!: Peer.Instance
  callerId!: string
  selfSocketId!: string
  callerSignal!: SignalData
  callToId!: string
  soundConnection: Howl
  soundCalling: Howl
  socket: Socket
  selfVideoDom: HTMLVideoElement
  selfInterlocutorDom: HTMLVideoElement
  constructor() {
    this.dispatch = store.dispatch
    this.soundConnection = $sound(Sounds.connection, true)
    this.soundCalling = $sound(Sounds.ring, true)
    this.socket = socket
    this.selfVideoDom = document.getElementById('self-video') as HTMLVideoElement
    this.selfInterlocutorDom = document.getElementById('interlocutor-video') as HTMLVideoElement
  }

  initConnection(options: any) {
    this.connection = new Peer(options)
  }

  async initCall(interlocutorData: User, selfId: string, selfAvatarPath: string, callerName: string) {
    this.selfId = selfId
    this.callToId = interlocutorData.id
    this.dispatch(initModalToCall(interlocutorData))
    this.soundConnection.play()
    this.initConnection({
      initiator: true,
      trickle: false,
      stream: this.selfStream
    })
    this.connection.on('signal', (data: SignalData) => {
      const settings = store.getState().calls.settings
      this.socket.emit(SocketActions.CALL_USER, {
        userToCall: interlocutorData.id,
        signalData: data,
        from: selfId,
        avatar: selfAvatarPath,
        callerName,
        settings
      })
    })
    this.connection.on('stream', (interlocutorStream: MediaStream) => {
      this.interlocutorStream = interlocutorStream
      this.selfInterlocutorDom.srcObject = interlocutorStream
    })
    this.connection.on('close', () => {
      this.dispatch(
        showNotification({
          message: 'Call completed',
          messageType: 'info'
        })
      )
      this.socket.off(SocketActions.CALL_ACCEPTED)
    })
    this.socket.on(SocketActions.CALL_ACCEPTED, (data) => {
      this.soundConnection.stop()
      this.dispatch(setCurrentCallAccepted())
      this.dispatch(updateInterlocutorSettings(data.settings))
      this.connection.signal(data.signal)
    })
    this.listenConnectionError()
  }

  answerCall() {
    this.soundCalling.stop()
    this.dispatch(setCurrentCallAccepted())
    this.initConnection({
      initiator: false,
      trickle: false,
      stream: this.selfStream
    })
    this.connection.on('signal', (data) => {
      const settings = store.getState().calls.settings
      this.socket.emit(SocketActions.ANSWER_CALL, {
        signal: data,
        to: this.callerId,
        settings,
        selfSocketId: this.socket.id
      })
    })
    this.connection.on('stream', (interlocutorStream: MediaStream) => {
      this.interlocutorStream = interlocutorStream
      this.selfInterlocutorDom.srcObject = interlocutorStream
    })
    this.connection.on('close', () => {
      this.dispatch(
        showNotification({
          message: 'Call completed',
          messageType: 'info'
        })
      )
      this.socket.off(SocketActions.ANSWER_CALL)
    })
    this.connection.signal(this.callerSignal)
    this.listenConnectionError()
  }

  async setStream() {
    const { audio, video } = store.getState().calls.settings
    try {
      this.selfStream = await navigator.mediaDevices.getUserMedia({ audio, video })
      this.selfVideoDom.srcObject = this.selfStream
    } catch (error) {
      $clg('error', 'Failed to get device cause ' + String(error))
      this.dispatch(
        showNotification({
          message: 'Failed to connect to device, check for device is plugged in',
          messageType: 'warning'
        })
      )
    }
    return Boolean(this.selfStream)
  }

  calling(callerId: string, callerSignal: SignalData) {
    this.soundCalling.play()
    this.callerId = callerId
    this.callerSignal = callerSignal
  }

  toggleSetting(type: string) {
    const { audio, video } = store.getState().calls.settings
    const isVideo = type === 'video'
    const tracks = isVideo ? 'getVideoTracks' : 'getAudioTracks'
    this.selfStream[tracks]().forEach((track) => (track.enabled = isVideo ? video : audio))
    this.socket.emit(SocketActions.CHANGE_CALL_SETTINGS, { audio, video })
  }

  leaveCall() {
    this.soundCalling.stop()
    this.soundConnection.stop()
    this.dispatch(closeCallModal())
    const tracks = this.selfStream.getTracks()
    tracks.forEach((track) => {
      track.stop()
    })
    this.socket = socket
    if (this.connection) this.connection.destroy()
  }

  listenConnectionError() {
    this.connection.on('error', (e: any) => {
      console.log(e)
    })
  }
}

export default new Call()
