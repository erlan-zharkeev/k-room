import { Avatar, Button } from 'antd'
import { UserOutlined, VideoCameraOutlined, PhoneOutlined, AudioOutlined } from '@ant-design/icons'
import { CallModalBodyProps } from '../../@types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { closeCallModal, setMinify, toggleEnableVideo } from 'src/store/callsSlice'
import CallModalVideo from '../CallModalVideo/CallModalVideo'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { useState } from 'react'

export const CallModalBody = ({ toggleExpandModal }: CallModalBodyProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { videoEnabled } = useTypedSelector((state) => state.calls)
  const showInterlocutorVideo = false
  const Navigator = navigator as any
  const [stream, setStream] = useState(null) as any
  const [userVideoRef, setVideoRef] = useState(null)

  const getUserVideoRef = (video: any) => {
    console.log(video)
  }

  const toggleVideo = () => {
    dispatch(toggleEnableVideo(!videoEnabled))
    if (videoEnabled) {
      Navigator.getUserMedia(
        { audio: true, video: { width: 1280, height: 720 } },
        (stream: any) => {
          console.log(userVideoRef, stream)
          const userVideo = document.getElementById('user-video') as any
          userVideo.srcObject = stream
          // setStream(stream)
        },
        (err: any) => {
          console.log(err)
        }
      )
    }
  }
  return (
    <div className="call-modal">
      <div className="call-modal__wrapper">
        <div className="call-modal__header">
          <div className="call-modal__title header-text header-text--sm">Outgoing audio call</div>
          <div className="call-modal__window-controls">
            <div className="call-modal__rollup" onClick={() => dispatch(setMinify())} />
            <div className="call-modal__expand" onClick={toggleExpandModal} />
            <div className="call-modal__close" onClick={() => dispatch(closeCallModal())} />
          </div>
        </div>
        <div className="call-modal__body">
          {showInterlocutorVideo ? (
            <div className="call-modal__center">
              <div className="call-modal__avatar">
                <Avatar size={150} src="" icon={<UserOutlined />} />
              </div>
              <div className="call-modal__interlocutor-name header-text header-text--secondary header-text--bold header-text--md">
                Иван Судовых
              </div>
              <div className="call-modal__length header-text header-text--secondary header-text--sm">09:07</div>
            </div>
          ) : (
            <CallModalVideo getUserVideoRef={(videoRef: any) => setVideoRef(videoRef)} />
          )}
          <div className="call-modal__controls">
            <div className="call-modal__controls-element">
              <Button icon={<VideoCameraOutlined />} size="large" shape="circle" onClick={toggleVideo} />
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
  )
}

export default CallModalBody
