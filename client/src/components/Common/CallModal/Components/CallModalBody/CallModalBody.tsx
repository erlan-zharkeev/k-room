import { CallModalBodyProps } from '../../@types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import {
  setCallId,
  setCallStartedAt,
  setMinify,
  setShowCallModal,
  toggleCallAudio,
  toggleCallVideo,
  updateInterlocutorSettings
} from 'src/store/callsSlice'
import CallModalVideo from '../CallModalVideo/CallModalVideo'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { useContext, useEffect, useState } from 'react'
import CallDots from '../CallDots/CallDots'
import { firstCharUpperCase } from 'src/utils/firstCharUpperCase'
import moment from 'moment'
import { CallStatus, CallType, SocketActions, SocketActionsPayload, UserMediaType } from 'common-types'
import { socket } from 'src/socket/socket'
import useCounter from 'src/hooks/useCounter'
import { UIButton, UIAvatar } from 'src/components/UI'
import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { RefsContext } from 'src/providers/RefsProvider'
import { AdditionalServiceContext } from 'src/providers/AdditionalServiceProvider'

const CallModalBody = ({ toggleExpandModal }: CallModalBodyProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { settings, currentCall } = useTypedSelector((state) => state.calls)
  const { avatarPath } = useTypedSelector((state) => state.user.userData)
  const [isAnswerLoading, setIsAnswerLoading] = useState(false)
  const [counterValue, _, startCounter, stopCounter] = useCounter(0)

  const { selfVideoDom } = useContext(RefsContext)

  const { $call } = useContext(AdditionalServiceContext)

  useEffect(() => {
    socket.on(SocketActions.CALL_STARTED_AT, (timeStamp: SocketActionsPayload['callStartedAt']) => {
      dispatch(setCallStartedAt(timeStamp))
      stopCounter()
      startCounter()
    })
    socket.on(SocketActions.CALL_USER, (data: SocketActionsPayload['callUser']) => {
      dispatch(setShowCallModal(data))
      const { from, signal, settings, callId } = data
      if (callId) dispatch(setCallId(callId))
      call.current.calling(from, signal)
      dispatch(updateInterlocutorSettings(settings))
    })
    socket.on(SocketActions.CALL_ENDED, () => {
      call.current.leaveCall(currentCall.id)
    })
    socket.on(SocketActions.CHANGE_CALL_SETTINGS, (data: SocketActionsPayload['changeCallSettings']) => {
      dispatch(updateInterlocutorSettings(data))
    })
  }, [])

  const endCall = () => {
    stopCounter()
    call.current.leaveCall(currentCall.id)
  }

  const answerCall = async () => {
    setIsAnswerLoading(true)
    const gotStream = await call.current.setStream()
    setIsAnswerLoading(false)
    if (gotStream) call.current.answerCall(currentCall.id)
  }

  const toggleAudio = () => {
    dispatch(toggleCallAudio())
    call.current.toggleSetting(UserMediaType.audio)
  }

  const toggleVideo = async () => {
    dispatch(toggleCallVideo())
    call.current.toggleSetting(UserMediaType.video)
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
              {currentCall.interlocutorName} {currentCall.type === CallType.incoming && <span>is calling</span>}
            </div>
            <CallDots />
          </div>

          <CallModalVideo />
          <div className="call-modal__user-video">
            <video autoPlay muted ref={selfVideoDom} id="self-video" className={!settings.video ? 'd-none' : ''} />
            <Avatar size="small" src={avatarPath} icon={<UserOutlined />} className={settings.video ? 'd-none' : ''} />
          </div>

          <div className="call-modal__controls">
            {currentCall.status === CallStatus.inProgress && (
              <div className="call-modal__length header-text header-text--sm">
                {moment.utc(counterValue * 1000).format('HH:mm:ss')}
              </div>
            )}
            <div className="call-modal__controls-elements">
              {currentCall.type === CallType.incoming && currentCall.status === CallStatus.calling && (
                <div className="call-modal__controls-element call-modal__controls-element--phone-answer">
                  <UIButton
                    iconName={isAnswerLoading ? 'loader' : 'call'}
                    onClick={answerCall}
                    tooltip="Answer"
                    color={isAnswerLoading ? 'default' : 'success'}
                  />
                </div>
              )}
              <div className="call-modal__controls-element">
                <UIButton
                  iconName={settings.video ? 'video-call-thin' : 'video-drop'}
                  color={settings.video ? 'default' : 'error'}
                  onClick={toggleVideo}
                  tooltip="Toggle Call Type"
                />
              </div>
              <div className="call-modal__controls-element call-modal__controls-element--phone">
                <UIButton iconName="phone-drop" color="error" onClick={endCall} tooltip="End Call" />
              </div>
              <div className="call-modal__controls-element">
                <UIButton
                  iconName={settings.audio ? 'mic' : 'mic-muted'}
                  color={settings.audio ? 'default' : 'error'}
                  onClick={toggleAudio}
                  tooltip="Toggle Audio Type"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallModalBody
