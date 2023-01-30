import { Dropdown, Menu, Button } from 'antd'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { SettingOutlined } from '@ant-design/icons'
import { useEffect, useRef } from 'react'

export const CallModalVideo = ({ getUserVideoRef }: any) => {
  const { videoEnabled } = useTypedSelector((state) => state.calls)
  const userVideo = useRef(null)
  useEffect(() => {
    getUserVideoRef(userVideo.current)
    console.log(userVideo.current)
  }, [])

  return (
    <div className="call-modal-video" ref={userVideo}>
      <div className="call-modal-video__interlocutor-video">
        <video src="./video/test.mp4" autoPlay loop />
      </div>
      {videoEnabled && (
        <div className="call-modal-video__user-video">
          <video autoPlay id="user-video" />
        </div>
      )}
      <div className="call-modal-video__settings">
        <Dropdown
          overlay={
            <Menu
              items={[
                { key: '1', label: 'setting1' },
                { key: '2', label: 'setting2' }
              ]}
            ></Menu>
          }
          placement="topLeft"
        >
          <SettingOutlined />
        </Dropdown>
      </div>
    </div>
  )
}

export default CallModalVideo
