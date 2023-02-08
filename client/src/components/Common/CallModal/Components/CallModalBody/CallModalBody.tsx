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
import { setMinify, toggleCallAudio, toggleCallVideo } from 'src/store/callsSlice'
import CallModalVideo from '../CallModalVideo/CallModalVideo'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { useEffect, useState } from 'react'
import CallDots from '../CallDots/CallDots'
import call from 'src/call/call'
import firstCharUpperCase from 'src/utils/firstCharUpperCase'
import { timeStamp } from 'console'
import moment from 'moment'

export const CallModalBody = ({ toggleExpandModal }: CallModalBodyProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { settings, currentCall } = useTypedSelector((state) => state.calls)
  const { startedAt } = useTypedSelector((state) => state.calls.currentCall)
  const [isAnswerLoading, setIsAnswerLoading] = useState(false)
  const [length, setLength] = useState(Date.now() - startedAt)

  // useEffect(() => {
  //   // setInterval(() => {
  //   //   // call.connection.
  //   //   // setLength((length) => {
  //   //   //   return (length = length + 1)
  //   //   // })
  //   // }, 1000)
  // }, [startedAt])

  const answerCall = async () => {
    setIsAnswerLoading(true)
    const gotStream = await call.setStream()
    setIsAnswerLoading(false)
    if (gotStream) call.answerCall()
  }

  const toggleAudio = () => {
    dispatch(toggleCallAudio())
    call.toggleAudio()
  }

  const toggleVideo = async () => {
    dispatch(toggleCallVideo())
    call.toggleVideo()
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
              <div className="call-modal__length header-text header-text--secondary header-text--sm">
                {moment.utc(length * 1000).format('HH:mm:ss')}
              </div>
            )}
            <div className="call-modal__controls-elements">
              {currentCall.type === 'incoming' && currentCall.status === 'calling' && (
                <div className="call-modal__controls-element call-modal__controls-element--phone-answer">
                  <Button
                    icon={isAnswerLoading ? <LoadingOutlined /> : <PhoneOutlined />}
                    size="large"
                    shape="circle"
                    onClick={answerCall}
                  />
                </div>
              )}
              <div className="call-modal__controls-element">
                {currentCall.status === 'calling' && (
                  <Button
                    icon={isAnswerLoading ? <LoadingOutlined /> : <VideoCameraOutlined />}
                    size="large"
                    shape="circle"
                    onClick={answerCall}
                  />
                )}
                {currentCall.status === 'in-progress' && (
                  <Button
                    icon={<VideoCameraOutlined />}
                    className={!settings.video && 'call-modal__controls-element--video-block'}
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
                  icon={settings.audio ? <AudioMutedOutlined /> : <AudioOutlined />}
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
