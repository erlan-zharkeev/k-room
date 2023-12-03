import { SocketActions, SocketActionsPayload, UserMediaType, CallStatus, CallType } from 'common-types'
import moment from 'moment'
import { useState, useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { UIButton, UIAvatar } from 'src/components'
import { useTypedSelector, useCounter } from 'src/hooks'
import { AppDispatch } from 'src/store'
import {
  setCallStartedAt,
  setShowCallModal,
  setCallId,
  setMinify,
  setCallAudio,
  setCallSettingsLoading,
  setCallVideo
} from 'src/store/calls-slice'
import { firstCharUpperCase } from 'src/utils'
import { CallDots, CallModalVideo } from './components'
import { $socket } from 'src/services'
import { RefsContext, AdditionalServiceContext } from 'src/providers'

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
    $socket.on(SocketActions.CALL_STARTED_AT, (timeStamp: SocketActionsPayload['callStartedAt']) => {
      dispatch(setCallStartedAt(timeStamp))
      stopCounter()
      startCounter()
    })
    $socket.on(SocketActions.CALL_USER, (data: SocketActionsPayload['callUser']) => {
      dispatch(setShowCallModal(data))
      const { from, signal, callId } = data
      if (callId) dispatch(setCallId(callId))
      call.current.calling(from, signal)
    })
    $socket.on(SocketActions.CALL_ENDED, () => {
      call.current.leaveCall(currentCall.id)
      stopCounter()
    })
    $socket.on(SocketActions.INTERLOCUTOR_UPDATE_SIGNAL, (data: SocketActionsPayload['interlocutorUpdateSignal']) => {
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
    dispatch(setCallSettingsLoading({ type: UserMediaType.audio, value: true }))
    await call.current.enableAudio({ video: settings.video.value })
    dispatch(setCallSettingsLoading({ type: UserMediaType.audio, value: false }))
  }

  const disableAudio = async () => {
    dispatch(setCallAudio(false))
    call.current.disableAudio()
  }

  const enableVideo = async () => {
    dispatch(setCallVideo(true))
    dispatch(setCallSettingsLoading({ type: UserMediaType.video, value: true }))
    await call.current.enableVideo({ callId: currentCall.id, audio: settings.audio.value })
    dispatch(setCallSettingsLoading({ type: UserMediaType.video, value: false }))
  }

  const disableVideo = async () => {
    dispatch(setCallVideo(false))
    call.current.disableVideo(false)
  }

  const hideSelfVideo = () => !settings.video.value || settings.video.loading
  const isCallInProgress = () => currentCall.status === CallStatus.inProgress
  const isCallIncoming = () => currentCall.type === CallType.incoming
  const isIncomingCallCalling = () => isCallIncoming() && currentCall.status === CallStatus.calling

  return (
    <div className="call-modal">
      <div className="call-modal__wrapper">
        <div className="call-modal__header">
          <div className="call-modal__window-controls">
            <div className="call-modal__window-controls-element">
              <UIButton
                iconName="cross-2"
                onClick={endCall}
                border="borderless"
                shape="circle"
                size="small"
                hover="hoverless"
                tooltip="Leave Call"
              />
            </div>
            <div className="call-modal__window-controls-element">
              <UIButton
                iconName="dash"
                onClick={minifyModal}
                border="borderless"
                shape="circle"
                size="small"
                hover="hoverless"
                tooltip="Minify Modal Call"
              />
            </div>
            <div className="call-modal__window-controls-element">
              <UIButton
                iconName="expand"
                onClick={toggleExpandModal}
                border="borderless"
                shape="circle"
                size="small"
                hover="hoverless"
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
              <UIAvatar size="large" src={currentCall.interlocutorAvatarPath} showBadge={false} />
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
                    <UIAvatar src={avatarPath} showBadge={false} size="small" />
                  </div>
                </div>
              </div>
              <div className="call-modal__user-settings">
                {settings.audio.value}
                <div className="call-modal__user-setting">
                  {settings.video.value ? (
                    <UIButton
                      iconName={settings.video.loading ? 'loader' : 'video-drop'}
                      color="default"
                      onClick={disableVideo}
                      tooltip="Disable Video"
                    />
                  ) : (
                    <UIButton
                      iconName={settings.video.loading ? 'loader' : 'video-call-thin'}
                      color="default"
                      onClick={enableVideo}
                      tooltip="Enable Video"
                    />
                  )}
                </div>
                <div className="call-modal__user-setting">
                  {settings.audio.value ? (
                    <UIButton
                      iconName={settings.audio.loading ? 'loader' : 'mic-muted'}
                      color="default"
                      onClick={disableAudio}
                      tooltip="Disable Audio"
                    />
                  ) : (
                    <UIButton
                      iconName={settings.audio.loading ? 'loader' : 'mic'}
                      color="default"
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
                  <UIButton
                    onClick={answerCall}
                    tooltip="Accept call"
                    color={isAnswerLoading ? 'default' : 'success'}
                    text="Accept call"
                    loading={isAnswerLoading}
                    border="border-default"
                  />
                </div>
              )}
              <div className="call-modal__controls-element call-modal__controls-element--phone">
                <UIButton color="error" onClick={endCall} text="Decline call" border="border-default" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
