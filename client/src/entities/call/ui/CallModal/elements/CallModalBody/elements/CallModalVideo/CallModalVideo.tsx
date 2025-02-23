import './style.scss'
import { useContext } from 'react'
import { useTypedSelector } from 'src/shared/lib'
import { RefsContext } from 'src/shared/providers'
import { Avatar } from 'src/shared/ui'

export const CallModalVideo = () => {
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
            <Avatar src={currentCall.interlocutorAvatarPath} showBadge={false} size="extra-large" />
          </div>
        </div>
      </div>
    </div>
  )
}
