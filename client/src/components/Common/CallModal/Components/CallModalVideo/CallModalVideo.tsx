import { Avatar } from 'antd'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { UserOutlined } from '@ant-design/icons'
import { UIIcon } from 'src/components/UI'

const CallModalVideo = () => {
  const { currentCall } = useTypedSelector((state) => state.calls)

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
            <UIIcon name="mic-muted" color="white" />
            <div className="paragraph-text paragraph-text--sm">The interlocutor turned off the sound</div>
          </div>
        )}
        <video autoPlay id="interlocutor-video" className={!currentCall?.interlocutorSettings?.video ? 'd-none' : ''} />
        <Avatar
          src={currentCall.interlocutorAvatarPath}
          icon={<UserOutlined />}
          className={currentCall?.interlocutorSettings?.video ? 'd-none' : ''}
        />
      </div>
    </div>
  )
}

export default CallModalVideo
