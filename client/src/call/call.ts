import { User, SocketActions } from 'common-types'
import { Howl } from 'howler'
import Peer, { SignalData } from 'simple-peer'
import $clg from 'src/services/$clg'
import { $sound, Sounds } from 'src/services/$sound'
import { socket } from 'src/socket/socket'
import { AppDispatch } from 'src/store'
import { closeCallModal, initModalToCall, setCurrentCallAccepted } from 'src/store/callsSlice'
import { store } from 'src/store/index'
import { showNotification } from 'src/store/systemSlice'

class Call {
  selfId: string
  dispatch: AppDispatch
  selfStream: MediaStream
  connection: Peer.Instance
  callerId: string
  callerSignal: SignalData
  callToId: string
  soundConnection: Howl
  soundCalling: Howl
  constructor() {
    this.dispatch = store.dispatch
    this.soundConnection = $sound(Sounds.connection, true)
    this.soundCalling = $sound(Sounds.ring, true)
  }

  async listenConnectionError() {
    this.connection.on('error', (e: any) => {
      console.log(e)
    })
  }

  async initCall(interlocutorData: User, selfId: string, selfAvatarPath: string, callerName: string) {
    this.selfId = selfId
    this.callToId = interlocutorData.id
    this.dispatch(initModalToCall(interlocutorData))
    this.soundConnection.play()
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: this.selfStream
    })
    peer.on('signal', (data: SignalData) => {
      console.log(data)
      socket.emit(SocketActions.CALL_USER, {
        userToCall: interlocutorData.id,
        signalData: data,
        from: selfId,
        avatar: selfAvatarPath,
        callerName
      })
    })
    peer.on('stream', (interlocutorStream: MediaStream) => {
      const interlocutorVideo = document.getElementById('interlocutor-video') as HTMLVideoElement
      interlocutorVideo.srcObject = interlocutorStream
    })

    peer.on('close', () => {
      this.dispatch(
        showNotification({
          message: 'Call completed',
          messageType: 'info'
        })
      )
    })
    socket.on(SocketActions.CALL_ACCEPTED, (signal: SignalData) => {
      this.soundConnection.stop()
      this.dispatch(setCurrentCallAccepted())
      peer.signal(signal)
    })
    this.connection = peer
    this.listenConnectionError()
  }

  answerCall() {
    this.soundCalling.stop()
    this.dispatch(setCurrentCallAccepted())
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: this.selfStream
    })
    peer.on('signal', (data: any) => {
      socket.emit(SocketActions.ANSWER_CALL, { signal: data, to: this.callerId })
    })
    peer.on('stream', (stream: MediaStream) => {
      const interlocutorVideo = document.getElementById('interlocutor-video') as HTMLVideoElement
      interlocutorVideo.srcObject = stream
    })
    peer.signal(this.callerSignal)
    this.connection = peer
    this.listenConnectionError()
  }

  async setStream(video?: boolean) {
    const selfVideo = document.getElementById('self-video') as HTMLVideoElement
    try {
      this.selfStream = await navigator.mediaDevices.getUserMedia({ audio: true, video })
      selfVideo.srcObject = this.selfStream
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

  toggleVideo(value: boolean) {
    if (!value && this.selfStream.getVideoTracks().length === 0) {
      this.setStream(true)
      return
    }
    this.selfStream.getVideoTracks().forEach((track) => (track.enabled = value))
  }

  toggleAudio(value: boolean) {
    this.selfStream.getAudioTracks().forEach((track) => (track.enabled = value))
  }

  leaveCall() {
    if (this.connection) this.connection.destroy()
    this.callToId ? this.soundCalling.stop() : this.soundConnection.stop()
    socket.emit(SocketActions.CALL_ENDED, this.callerId ?? this.callToId)
    this.dispatch(closeCallModal())
    const tracks = this.selfStream.getTracks()
    tracks.forEach((track) => {
      track.stop()
    })
  }
}

export default new Call()
