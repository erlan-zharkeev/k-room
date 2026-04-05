import './style.scss'
import { useContext } from 'react'

import { CALL_MODAL_VIDEO_I18N } from 'src/entities/call/ui'
import { useI18n } from 'src/entities/settings'

import { useTypedSelector } from 'src/shared/lib'
import { RefsContext } from 'src/shared/providers'
import { AppAvatar } from 'src/shared/ui'

export const CallModalVideo = () => {
  const { currentCall } = useTypedSelector((state) => state.calls)
  const { interlocutorVideoDom } = useContext(RefsContext)
  const { t } = useI18n()
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
            <div className="paragraph-text paragraph-text--sm">{t(CALL_MODAL_VIDEO_I18N.audioOff)}</div>
          </div>
        )}
        {/* Live WebRTC stream preview does not provide caption tracks. */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          loop
          autoPlay
          playsInline
          id="interlocutor-video"
          ref={interlocutorVideoDom}
          className={!currentCall?.interlocutorSettings?.video ? 'call-modal-video__hide' : ''}
        />
        <div className="call-modal-video__interlocutor-avatar">
          <div className={currentCall?.interlocutorSettings?.video ? 'call-modal-video__hide' : ''}>
            <AppAvatar src={currentCall.interlocutorAvatarPath} showBadge={false} size="large" />
          </div>
        </div>
      </div>
    </div>
  )
}
