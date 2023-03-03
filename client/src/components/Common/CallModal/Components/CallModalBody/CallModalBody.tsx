import { CallModalBodyProps } from '../../@types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import {
  setCallStartedAt,
  setMinify,
  setShowCallModal,
  toggleCallAudio,
  toggleCallVideo,
  updateInterlocutorSettings
} from 'src/store/callsSlice'
import CallModalVideo from '../CallModalVideo/CallModalVideo'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { useEffect, useState } from 'react'
import CallDots from '../CallDots/CallDots'
import firstCharUpperCase from 'src/utils/firstCharUpperCase'
import moment from 'moment'
import { SocketActions } from 'common-types'
import { socket } from 'src/socket/socket'
import call from 'src/services/$call'
import UIAvatar from 'ui/UIAvatar'
import UIButton from 'ui/UIButton'

export const CallModalBody = ({ toggleExpandModal }: CallModalBodyProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { settings, currentCall } = useTypedSelector((state) => state.calls)
  const [isAnswerLoading, setIsAnswerLoading] = useState(false)
  const [length, setLength] = useState(0)

  let timerId: string | number | NodeJS.Timeout = null

  const lengthCounter = () => {
    setLength((length) => {
      return length + 1
    })
  }

  const startTimer = () => {
    if (timerId) clearTimeout(timerId)
    timerId = setInterval(lengthCounter, 1000)
  }

  const stopTimer = () => {
    setLength(0)
    return clearTimeout(timerId)
  }

  useEffect(() => {
    socket.on(SocketActions.CALL_STARTED_AT, (timeStamp: number) => {
      dispatch(setCallStartedAt(timeStamp))
      stopTimer()
      startTimer()
    })
    socket.on(SocketActions.CALL_USER, (data) => {
      dispatch(setShowCallModal(data))
      const { from, signal, settings } = data
      call.calling(from, signal)
      dispatch(updateInterlocutorSettings(settings))
    })
    socket.on(SocketActions.CALL_ENDED, () => {
      call.leaveCall()
    })
    socket.on(SocketActions.CHANGE_CALL_SETTINGS, (data) => {
      dispatch(updateInterlocutorSettings(data))
    })
  }, [])

  const endCall = () => {
    stopTimer()
    socket.emit(SocketActions.CALL_ENDED, call.callerId ?? call.callToId)
    call.leaveCall()
  }

  const answerCall = async () => {
    setIsAnswerLoading(true)
    const gotStream = await call.setStream()
    setIsAnswerLoading(false)
    if (gotStream) call.answerCall()
  }

  const toggleAudio = () => {
    dispatch(toggleCallAudio())
    call.toggleSetting('audio')
  }

  const toggleVideo = async () => {
    dispatch(toggleCallVideo())
    call.toggleSetting('video')
  }

  const minifyModal = () => {
    dispatch(setMinify())
  }

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
              <UIAvatar size="large" src={currentCall.interlocutorAvatar} showBadge={false} />
            </div>
            <div className="call-modal__interlocutor-name header-text header-text--secondary header-text--bold header-text--md">
              {currentCall.interlocutorName} {currentCall.type === 'incoming' && <span>is calling</span>}
            </div>
            <CallDots />
          </div>
          <CallModalVideo />

          <div className="call-modal__controls">
            {currentCall.status === 'in-progress' && (
              <div className="call-modal__length header-text header-text--sm">
                {moment.utc(length * 1000).format('HH:mm:ss')}
              </div>
            )}
            <div className="call-modal__controls-elements">
              {currentCall.type === 'incoming' && currentCall.status === 'calling' && (
                <div className="call-modal__controls-element call-modal__controls-element--phone-answer">
                  <UIButton iconName={isAnswerLoading ? 'loader' : 'call'} onClick={answerCall} />
                </div>
              )}
              <div className="call-modal__controls-element">
                {currentCall.status === 'calling' && (
                  <UIButton iconName={isAnswerLoading ? 'loader' : 'video-call'} onClick={answerCall} />
                )}
                {currentCall.status === 'in-progress' && (
                  <UIButton
                    iconName={settings.video ? 'video-call' : 'video-drop'}
                    color={settings.video ? 'success' : 'error'}
                    className={!settings.video && 'call-modal__controls-element--video-block'}
                    onClick={toggleVideo}
                  />
                )}
              </div>
              <div className="call-modal__controls-element call-modal__controls-element--phone">
                <UIButton iconName="phone-drop" color="error" onClick={endCall} />
              </div>
              <div className="call-modal__controls-element">
                <UIButton iconName={settings.audio ? 'mic-muted' : 'mic'} onClick={toggleAudio} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallModalBody
