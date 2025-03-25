import './style.scss'
import { EventCallStartedAt, EventCallUser, EventInterlocutorUpdateSignal, SocketActions } from 'common-types'
import moment from 'moment'
import { useState, useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector, useCounter } from 'src/shared/lib'
import { AppDispatch } from 'src/app/store'
import { socket } from 'src/shared/api'
import { AppButton, AppAvatar } from 'src/shared/ui'
import { firstCharUpperCase } from 'src/shared/utils'
import { RefsContext, AdditionalServiceContext } from 'src/shared/providers'
import { CallDots, CallModalVideo } from './elements'
import {
  setCallStartedAt,
  setShowCallModal,
  setCallId,
  setMinify,
  setCallAudio,
  setCallSettingsLoading,
  setCallVideo
} from 'src/entities/call'

export interface CallModalBodyProps {
  toggleExpandModal: () => void
}

export const CallModalBody = ({ toggleExpandModal }: CallModalBodyProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { settings, currentCall } = useTypedSelector((state) => state.calls)
  const { avatarPath } = useTypedSelector((state) => state.user.userData)
  const [isAnswerLoading, setIsAnswerLoading] = useState(false)
  const { selfVideoDom } = useContext(RefsContext)

  const { call } = useContext(AdditionalServiceContext)

  const [counterValue, _, startCounter, stopCounter] = useCounter(1, false)

  useEffect(() => {
    socket.on<SocketActions>('call-started-at', (timeStamp: EventCallStartedAt) => {
      dispatch(setCallStartedAt(timeStamp))
      stopCounter()
      startCounter()
    })
    socket.on<SocketActions>('call-user', (data: EventCallUser) => {
      dispatch(setShowCallModal(data))
      const { from, signal, callId } = data
      if (callId) dispatch(setCallId(callId))
      call.current.calling(from, signal)
    })
    socket.on<SocketActions>('call-ended', () => {
      call.current.leaveCall(currentCall.id)
      stopCounter()
    })
    socket.on<SocketActions>('interlocutor-update-signal', (data: EventInterlocutorUpdateSignal) => {
      call.current.updateCallerSignal(data.signal)
    })
  }, [])

  const endCall = () => {
    call.current.leaveCall(currentCall.id, stopCounter)
    stopCounter()
  }

  const answerCall = async () => {
    setIsAnswerLoading(true)
    await call.current.answerCall(currentCall.id, settings)
    setIsAnswerLoading(false)
  }

  const minifyModal = () => {
    dispatch(setMinify())
  }

  const enableAudio = async () => {
    dispatch(setCallAudio(true))
    dispatch(setCallSettingsLoading({ type: 'audio', value: true }))
    await call.current.enableAudio({ video: settings.video.value })
    dispatch(setCallSettingsLoading({ type: 'audio', value: false }))
  }

  const disableAudio = async () => {
    dispatch(setCallAudio(false))
    call.current.disableAudio()
  }

  const enableVideo = async () => {
    dispatch(setCallVideo(true))
    dispatch(setCallSettingsLoading({ type: 'video', value: true }))
    await call.current.enableVideo({ callId: currentCall.id, audio: settings.audio.value })
    dispatch(setCallSettingsLoading({ type: 'video', value: false }))
  }

  const disableVideo = async () => {
    dispatch(setCallVideo(false))
    call.current.disableVideo(false)
  }

  const hideSelfVideo = () => !settings.video.value || settings.video.loading
  const isCallInProgress = () => currentCall.status === 'in-progress'
  const isCallIncoming = () => currentCall.type === 'incoming'
  const isIncomingCallCalling = () => isCallIncoming() && currentCall.status === 'calling'

  return (
    <div className="call-modal">
      <div className="call-modal__wrapper">
        <div className="call-modal__header">
          <div className="call-modal__window-controls">
            <div className="call-modal__window-controls-element">
              <AppButton prefixIconName="cross-2" onClick={endCall} borderless hoverless tooltip="Leave Call" />
            </div>
            <div className="call-modal__window-controls-element">
              <AppButton prefixIconName="dash" onClick={minifyModal} borderless hoverless tooltip="Minify Modal Call" />
            </div>
            <div className="call-modal__window-controls-element">
              <AppButton
                prefixIconName="expand"
                onClick={toggleExpandModal}
                borderless
                hoverless
                tooltip="Expand Modal Call"
              />
            </div>
          </div>
          <div className="call-modal__title header-text header-text--sm header-text--secondary">
            {firstCharUpperCase(currentCall.type)} call
          </div>
        </div>
        <div className="call-modal__body">
          <div
            className="call-modal__center"
            style={{
              display: currentCall.status === 'calling' ? 'flex' : 'none'
            }}
          >
            <div className="call-modal__avatar">
              <AppAvatar size="large" src={currentCall.interlocutorAvatarPath} showBadge={false} />
            </div>
            <div className="call-modal__interlocutor-name header-text header-text--secondary header-text--bold header-text--md">
              {currentCall.interlocutorName} {isCallIncoming() && <span>is calling</span>}
            </div>
            <CallDots />
          </div>
          <CallModalVideo />
          {isCallInProgress() && (
            <div>
              <div className="call-modal__user-video">
                <video
                  loop
                  playsInline
                  autoPlay
                  muted
                  ref={selfVideoDom}
                  id="self-video"
                  className={hideSelfVideo() ? 'd-none' : ''}
                />
                <div className="call-modal__user-avatar">
                  <div className={settings.video.value ? 'd-none' : ''}>
                    <AppAvatar src={avatarPath} showBadge={false} size="small" />
                  </div>
                </div>
              </div>
              <div className="call-modal__user-settings">
                {settings.audio.value}
                <div className="call-modal__user-setting">
                  {settings.video.value ? (
                    <AppButton
                      prefixIconName={settings.video.loading ? 'loader' : 'video-cancel'}
                      onClick={disableVideo}
                      tooltip="Disable Video"
                    />
                  ) : (
                    <AppButton
                      prefixIconName={settings.video.loading ? 'loader' : 'video-call-thin'}
                      onClick={enableVideo}
                      tooltip="Enable Video"
                    />
                  )}
                </div>
                <div className="call-modal__user-setting">
                  {settings.audio.value ? (
                    <AppButton
                      prefixIconName={settings.audio.loading ? 'loader' : 'mic-muted'}
                      onClick={disableAudio}
                      tooltip="Disable Audio"
                    />
                  ) : (
                    <AppButton
                      prefixIconName={settings.audio.loading ? 'loader' : 'mic'}
                      onClick={enableAudio}
                      tooltip="Enable Audio"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="call-modal__controls">
            {isCallInProgress() && (
              <div className="call-modal__length header-text header-text--sm">
                {moment.utc(counterValue * 1000).format('HH:mm:ss')}
              </div>
            )}
            <div className="call-modal__controls-elements">
              {isIncomingCallCalling() && (
                <div className="call-modal__controls-element call-modal__controls-element--phone-answer">
                  <AppButton
                    onClick={answerCall}
                    tooltip="Accept call"
                    color={isAnswerLoading ? 'accent-color' : 'success-color'}
                    text="Accept call"
                    loading={isAnswerLoading}
                  />
                </div>
              )}
              <div className="call-modal__controls-element call-modal__controls-element--phone">
                <AppButton color="error-color" onClick={endCall} text="Decline call" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
