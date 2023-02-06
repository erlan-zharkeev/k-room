import { Avatar, Button } from 'antd'
import {
  UserOutlined,
  VideoCameraOutlined,
  PhoneOutlined,
  AudioOutlined,
  LoadingOutlined,
  AudioMutedOutlined
} from '@ant-design/icons'
import { CallModalBodyProps } from '../../@types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { closeCallModal, setCurrentCallAccepted, setMinify, toggleEnableVideo } from 'src/store/callsSlice'
import CallModalVideo from '../CallModalVideo/CallModalVideo'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { useEffect, useState } from 'react'
import { showNotification } from 'src/store/systemSlice'
import CallDots from '../CallDots/CallDots'
import { socket } from 'src/socket/socket'
import { SocketActions } from 'common-types'
import call from 'src/call/call'
import firstCharUpperCase from 'src/utils/firstCharUpperCase'

export const CallModalBody = ({ toggleExpandModal }: CallModalBodyProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { currentCall } = useTypedSelector((state) => state.calls)
  const [isAnswerLoading, setIsAnswerLoading] = useState(false)
  const [audioMuted, setAudioMuted] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(false)

  const answerCall = async (video?: boolean) => {
    setIsAnswerLoading(true)
    const gotStream = await call.setStream(video)
    setIsAnswerLoading(false)
    if (gotStream) call.answerCall()
  }

  const toggleAudio = () => {
    setAudioMuted(!audioMuted)
    call.toggleAudio(audioMuted)
  }

  const toggleVideo = async () => {
    setVideoEnabled(!videoEnabled)
    call.toggleVideo(videoEnabled)
  }

  return (
    <div className="call-modal">
      <div className="call-modal__wrapper">
        <div className="call-modal__header">
          <div className="call-modal__title header-text header-text--sm">
            {firstCharUpperCase(currentCall.type)} call
          </div>
          <div className="call-modal__window-controls">
            <div className="call-modal__rollup" onClick={() => dispatch(setMinify())} />
            <div className="call-modal__expand" onClick={toggleExpandModal} />
            <div className="call-modal__close" onClick={() => call.leaveCall()} />
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
              <Avatar size={150} src={currentCall.interlocutorAvatar} icon={<UserOutlined />} />
            </div>
            <div className="call-modal__interlocutor-name header-text header-text--secondary header-text--bold header-text--md">
              {currentCall.interlocutorName} {currentCall.type === 'incoming' && <span>is calling</span>}
            </div>
            <CallDots />
          </div>
          <CallModalVideo />

          <div className="call-modal__controls">
            {currentCall.status === 'in-progress' && (
              <div className="call-modal__length header-text header-text--secondary header-text--sm">09:07</div>
            )}
            <div className="call-modal__controls-elements">
              {currentCall.type === 'incoming' && currentCall.status === 'calling' && (
                <div className="call-modal__controls-element call-modal__controls-element--phone-answer">
                  <Button
                    icon={isAnswerLoading ? <LoadingOutlined /> : <PhoneOutlined />}
                    size="large"
                    shape="circle"
                    onClick={async () => await answerCall(false)}
                  />
                </div>
              )}
              <div className="call-modal__controls-element">
                {currentCall.status === 'calling' && (
                  <Button
                    icon={isAnswerLoading ? <LoadingOutlined /> : <VideoCameraOutlined />}
                    size="large"
                    shape="circle"
                    onClick={async () => await answerCall(true)}
                  />
                )}
                {currentCall.status === 'in-progress' && (
                  <Button
                    icon={<VideoCameraOutlined />}
                    style={{
                      color: videoEnabled ? 'red' : 'green'
                    }}
                    size="large"
                    shape="circle"
                    onClick={toggleVideo}
                  />
                )}
              </div>
              <div className="call-modal__controls-element call-modal__controls-element--phone">
                <Button icon={<PhoneOutlined />} size="large" shape="circle" onClick={() => call.leaveCall()} />
              </div>
              <div className="call-modal__controls-element">
                <Button
                  icon={audioMuted ? <AudioOutlined /> : <AudioMutedOutlined />}
                  size="large"
                  shape="circle"
                  onClick={toggleAudio}
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
