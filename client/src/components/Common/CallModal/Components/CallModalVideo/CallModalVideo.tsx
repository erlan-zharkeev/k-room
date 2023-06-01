import { Avatar } from 'antd'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { UserOutlined, AudioMutedOutlined } from '@ant-design/icons'

export const CallModalVideo = () => {
  const { settings, currentCall } = useTypedSelector((state) => state.calls)
  const { avatar } = useTypedSelector((state) => state.user.userData)

  return (
    <div
      className="call-modal-video"
      style={{
        display: currentCall.status === 'calling' ? 'none' : 'flex'
      }}
    >
      <div className="call-modal-video__interlocutor-video">
        {!currentCall?.interlocutorSettings?.audio && (
          <div className="call-modal-video__interlocutor-audio-status">
            <AudioMutedOutlined />
            <div className="paragraph-text paragraph-text--sm">The interlocutor turned off the sound</div>
          </div>
        )}

        <video autoPlay id="interlocutor-video" className={!currentCall?.interlocutorSettings?.video ? 'd-none' : ''} />
        <Avatar
          src={currentCall.interlocutorAvatar}
          icon={<UserOutlined />}
          className={currentCall?.interlocutorSettings?.video ? 'd-none' : ''}
        />
      </div>
      <div className="call-modal-video__user-video">
        <video autoPlay muted id="self-video" className={!settings.video ? 'd-none' : ''} />
        <Avatar size="small" src={avatar} icon={<UserOutlined />} className={settings.video ? 'd-none' : ''} />
      </div>
      <div className="call-modal-video__settings">
        {/* <Dropdown
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
        </Dropdown> */}
      </div>
    </div>
  )
}

export default CallModalVideo
