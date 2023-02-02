import { Avatar, Button } from 'antd'
import { UserOutlined, VideoCameraOutlined, PhoneOutlined, AudioOutlined, LoadingOutlined } from '@ant-design/icons'
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
// import Peer from 'simple-peer'

export const CallModalBody = ({ toggleExpandModal }: CallModalBodyProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { videoEnabled, currentCall } = useTypedSelector((state) => state.calls)
  const [enableVideoLoader, setEnableVideoLoader] = useState(false)

  const toggleVideo = async () => {
    // if (videoEnabled) {
    //   const tracks = stream.getTracks()
    //   tracks.forEach((track) => {
    //     track.stop()
    //   })
    //   dispatch(toggleEnableVideo(false))
    //   return
    // }
    // const userVideo = document.getElementById('user-video') as HTMLVideoElement
    // setEnableVideoLoader(true)
    // try {
    //   const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { width: 300, height: 300 } })
    //   setStream(stream)
    //   userVideo.srcObject = stream
    //   dispatch(toggleEnableVideo(true))
    // } catch (e: any) {
    //   dispatch(showNotification({ messageType: 'error', message: 'Camera connection failed' }))
    // } finally {
    //   setEnableVideoLoader(false)
    // }
  }

  const answerCall = async () => {
    await call.setStream()
    call.answerCall()
  }

  return (
    <div className="call-modal">
      <div className="call-modal__wrapper">
        <div className="call-modal__header">
          <div className="call-modal__title header-text header-text--sm">
            {currentCall.type.toUpperCase()} audio call
          </div>
          <div className="call-modal__window-controls">
            <div className="call-modal__rollup" onClick={() => dispatch(setMinify())} />
            <div className="call-modal__expand" onClick={toggleExpandModal} />
            <div className="call-modal__close" onClick={() => dispatch(closeCallModal())} />
          </div>
        </div>
        <div className="call-modal__body">
          {/* currentCall.status == 'calling'  */}
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
              {currentCall.type === 'incoming' && (
                <div className="call-modal__controls-element call-modal__controls-element--phone-answer">
                  <Button icon={<PhoneOutlined />} size="large" shape="circle" onClick={answerCall} />
                </div>
              )}
              <div className="call-modal__controls-element">
                <Button
                  icon={enableVideoLoader ? <LoadingOutlined /> : <VideoCameraOutlined />}
                  size="large"
                  shape="circle"
                  onClick={toggleVideo}
                />
              </div>
              <div className="call-modal__controls-element call-modal__controls-element--phone">
                <Button icon={<PhoneOutlined />} size="large" shape="circle" />
              </div>
              <div className="call-modal__controls-element">
                <Button icon={<AudioOutlined />} size="large" shape="circle" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallModalBody
