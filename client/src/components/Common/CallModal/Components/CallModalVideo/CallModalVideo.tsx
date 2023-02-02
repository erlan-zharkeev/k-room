import { Dropdown, Menu } from 'antd'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { SettingOutlined } from '@ant-design/icons'

export const CallModalVideo = () => {
  const { videoEnabled, currentCall } = useTypedSelector((state) => state.calls)

  return (
    <div
      className="call-modal-video"
      style={{
        display: currentCall.status === 'calling' ? 'none' : 'flex'
      }}
    >
      <div className="call-modal-video__interlocutor-video">
        <video autoPlay id="interlocutor-video" />
      </div>
      <div className="call-modal-video__user-video">
        <video autoPlay muted id="self-video" />
      </div>
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
