import { User, SocketActions } from 'common-types'
import { Howl } from 'howler'
import Peer from 'simple-peer'
import { $sound, Sounds } from 'src/services/$sound'
import { socket } from 'src/socket/socket'
import { AppDispatch } from 'src/store'
import { closeCallModal, initModalToCall, setCurrentCallAccepted } from 'src/store/callsSlice'
import { store } from 'src/store/index'

class Call {
  selfId: string
  dispatch: AppDispatch
  selfStream: MediaStream
  connection: Peer.Instance
  callerId: string
  callerSignal: any
  soundConnection: Howl
  constructor() {
    this.selfId = store.getState().user.userData.id
    this.dispatch = store.dispatch
    this.soundConnection = $sound(Sounds.connection, true)
  }

  initCall(interlocutorData: User, selfId: string, selfAvatarPath: string) {
    this.dispatch(initModalToCall(interlocutorData))
    this.soundConnection.play()
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: this.selfStream
    })
    peer.on('signal', (data: any) => {
      socket.emit(SocketActions.CALL_USER, {
        userToCall: interlocutorData.id,
        signalData: data,
        from: selfId,
        avatar: selfAvatarPath
      })
    })
    peer.on('stream', (interlocutorStream: MediaStream) => {
      const interlocutorVideo = document.getElementById('interlocutor-video') as HTMLVideoElement
      interlocutorVideo.srcObject = interlocutorStream
    })
    socket.on(SocketActions.CALL_ACCEPTED, (signal) => {
      this.soundConnection.stop()
      this.dispatch(setCurrentCallAccepted())
      peer.signal(signal)
    })

    this.connection = peer
  }

  answerCall() {
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
  }

  async setStream() {
    const selfVideo = document.getElementById('self-video') as HTMLVideoElement
    this.selfStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { width: 300, height: 300 } })
    selfVideo.srcObject = this.selfStream
  }

  setCallerId(callerId: string) {
    this.callerId = callerId
  }

  setCallerSignal(callerSignal: any) {
    this.callerSignal = callerSignal
  }

  leaveCall() {
    this.dispatch(closeCallModal())
    this.connection.destroy()
    const tracks = this.selfStream.getTracks()
    this.soundConnection.stop()
    tracks.forEach((track) => {
      track.stop()
    })
  }

  getSelfStream() {
    return this.selfStream
  }
}

export default new Call()
