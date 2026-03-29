import './style.scss'
import { useState, useContext, useEffect } from 'react'

import { EventCallStartedAtType, IEventCallUser, IEventInterlocutorUpdateSignal, SocketActionsType } from 'common'
import { useDispatch } from 'react-redux'
import type { SignalData } from 'simple-peer'

import { AppDispatchType } from 'src/app/store'

import { callCounter } from 'src/features/call'

import {
  CallDots,
  CallModalVideo,
  setCallStartedAt,
  setShowCallModal,
  setCallId,
  setMinify,
  setCallAudio,
  setCallSettingsLoading,
  setCallVideo
} from 'src/entities/call'
import type { ICallModalBodyProps } from 'src/entities/call/ui'
import { CALL_MODAL_BODY_I18N } from 'src/entities/call/ui'
import { useI18n } from 'src/entities/system'

import { socket } from 'src/shared/api'
import { useTypedSelector, useCounter } from 'src/shared/lib'
import { RefsContext, AdditionalServiceContext } from 'src/shared/providers'
import { AppButton, AppAvatar } from 'src/shared/ui'

export const CallModalBody = ({ toggleExpandModal }: ICallModalBodyProps) => {
  const dispatch = useDispatch<AppDispatchType>()
  const { settings, currentCall } = useTypedSelector((state) => state.calls)
  const [isAnswerLoading, setIsAnswerLoading] = useState(false)
  const { selfVideoDom } = useContext(RefsContext)

  const { call } = useContext(AdditionalServiceContext)
  const callService = call.current
  const { t } = useI18n()

  const [counterValue, , startCounter, stopCounter] = useCounter(1, false)

  useEffect(() => {
    const handleCallStartedAt = (timeStamp: EventCallStartedAtType) => {
      dispatch(setCallStartedAt(timeStamp))
      stopCounter()
      startCounter()
    }

    const handleCallUser = (data: IEventCallUser) => {
      dispatch(setShowCallModal(data))
      const { from, signal, callId } = data
      if (callId) dispatch(setCallId(callId))
      callService?.calling(from, signal as SignalData)
    }

    const handleCallEnded = () => {
      callService?.leaveCall(currentCall.id)
      stopCounter()
    }

    const handleInterlocutorUpdateSignal = (data: IEventInterlocutorUpdateSignal) => {
      callService?.updateCallerSignal(data.signal as SignalData)
    }

    socket.on<SocketActionsType>('call-started-at', handleCallStartedAt)
    socket.on<SocketActionsType>('call-user', handleCallUser)
    socket.on<SocketActionsType>('call-ended', handleCallEnded)
    socket.on<SocketActionsType>('interlocutor-update-signal', handleInterlocutorUpdateSignal)

    return () => {
      socket.off<SocketActionsType>('call-started-at', handleCallStartedAt)
      socket.off<SocketActionsType>('call-user', handleCallUser)
      socket.off<SocketActionsType>('call-ended', handleCallEnded)
      socket.off<SocketActionsType>('interlocutor-update-signal', handleInterlocutorUpdateSignal)
    }
  }, [callService, currentCall.id, dispatch, startCounter, stopCounter])

  const endCall = () => {
    callService?.leaveCall(currentCall.id)
    stopCounter()
  }

  const answerCall = async () => {
    setIsAnswerLoading(true)
    await callService?.answerCall(currentCall.id)
    setIsAnswerLoading(false)
  }

  const minifyModal = () => {
    dispatch(setMinify())
  }

  const enableAudio = async () => {
    dispatch(setCallAudio(true))
    dispatch(setCallSettingsLoading({ type: 'audio', value: true }))
    await callService?.enableAudio({ video: settings.video.value })
    dispatch(setCallSettingsLoading({ type: 'audio', value: false }))
  }

  const disableAudio = async () => {
    dispatch(setCallAudio(false))
    callService?.disableAudio()
  }

  const enableVideo = async () => {
    dispatch(setCallVideo(true))
    dispatch(setCallSettingsLoading({ type: 'video', value: true }))
    await callService?.enableVideo({ callId: currentCall.id, audio: settings.audio.value })
    dispatch(setCallSettingsLoading({ type: 'video', value: false }))
  }

  const disableVideo = async () => {
    dispatch(setCallVideo(false))
    callService?.disableVideo()
  }

  const hideSelfVideo = () => !settings.video.value || settings.video.loading
  const isCallInProgress = () => currentCall.status === 'in-progress'
  const isCallIncoming = () => currentCall.flow === 'incoming'
  const isIncomingCallCalling = () => isCallIncoming() && currentCall.status === 'calling'

  return (
    <div className="call-modal">
      <div className="call-modal__wrapper">
        <div className="call-modal__header">
          <div className="call-modal__window-controls">
            <div className="call-modal__window-controls-element">
              <AppButton prefixIconName="cross-2" onClick={endCall} borderless hoverless />
            </div>
            <div className="call-modal__window-controls-element">
              <AppButton prefixIconName="dash" onClick={minifyModal} borderless hoverless />
            </div>
            <div className="call-modal__window-controls-element">
              <AppButton prefixIconName="expand" onClick={toggleExpandModal} borderless hoverless />
            </div>
          </div>
          <div className="call-modal__title">
            {isCallIncoming() ? t(CALL_MODAL_BODY_I18N.incomingCall) : t(CALL_MODAL_BODY_I18N.outgoingCall)}
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
            <div className="call-modal__interlocutor-name">
              {currentCall.interlocutorName} {isCallIncoming() && <span>{t(CALL_MODAL_BODY_I18N.isCalling)}</span>}
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
                  className={hideSelfVideo() ? 'call-modal__hide' : ''}
                />
                <div className="call-modal__user-avatar">
                  <div className={settings.video.value ? 'call-modal__hide' : ''}>
                    {/* <AppAvatar src={avatar} showBadge={false} size="small" /> */}
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
                    />
                  ) : (
                    <AppButton
                      prefixIconName={settings.video.loading ? 'loader' : 'video-call-thin'}
                      onClick={enableVideo}
                    />
                  )}
                </div>
                <div className="call-modal__user-setting">
                  {settings.audio.value ? (
                    <AppButton
                      prefixIconName={settings.audio.loading ? 'loader' : 'mic-muted'}
                      onClick={disableAudio}
                    />
                  ) : (
                    <AppButton prefixIconName={settings.audio.loading ? 'loader' : 'mic'} onClick={enableAudio} />
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="call-modal__controls">
            {isCallInProgress() && <div className="call-modal__length">{callCounter(counterValue)}</div>}
            <div className="call-modal__controls-elements">
              {isIncomingCallCalling() && (
                <div className="call-modal__controls-element call-modal__controls-element--phone-answer">
                  <AppButton
                    onClick={answerCall}
                    color={isAnswerLoading ? 'accent-color' : 'success-color'}
                    text={t(CALL_MODAL_BODY_I18N.acceptCall)}
                    loading={isAnswerLoading}
                  />
                </div>
              )}
              <div className="call-modal__controls-element call-modal__controls-element--phone">
                <AppButton color="error-color" onClick={endCall} text={t(CALL_MODAL_BODY_I18N.declineCall)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
