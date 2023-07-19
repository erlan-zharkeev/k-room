import { Avatar } from 'antd'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { UserOutlined } from '@ant-design/icons'
import { UIIcon } from 'src/components/UI'
import { useContext } from 'react'
import { RefsContext } from 'src/providers/RefsProvider'

const CallModalVideo = () => {
  const { currentCall } = useTypedSelector((state) => state.calls)
  const { interlocutorVideoDom } = useContext(RefsContext)

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
        <video
          autoPlay
          id="interlocutor-video"
          ref={interlocutorVideoDom}
          className={!currentCall?.interlocutorSettings?.video ? 'd-none' : ''}
        />
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
