import useTypedSelector from 'src/hooks/useTypedSelector'
import { UIAvatar, UIIcon } from 'src/components/UI'
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
          loop
          autoPlay
          playsInline
          id="interlocutor-video"
          ref={interlocutorVideoDom}
          className={!currentCall?.interlocutorSettings?.video ? 'd-none' : ''}
        />
        <div className="call-modal-video__interlocutor-avatar">
          <div className={currentCall?.interlocutorSettings?.video ? 'd-none' : ''}>
            <UIAvatar src={currentCall.interlocutorAvatarPath} showBadge={false} size="xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallModalVideo
