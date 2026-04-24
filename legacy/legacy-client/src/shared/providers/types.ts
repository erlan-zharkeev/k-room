import { SignalData } from 'simple-peer'

import { IFrontendUserData } from 'common'

import { ContextRefType } from 'src/shared/config'

export interface IRefsContext {
  interlocutorVideoDom: ContextRefType<HTMLVideoElement | null>
  selfVideoDom: ContextRefType<HTMLVideoElement | null>
}

export interface ICallService {
  calling: (callerId: string, callerSignalData: SignalData) => void
  leaveCall: (callId: string) => void
  answerCall: (callId: string) => Promise<void>
  initCall: (
    interlocutorData: IFrontendUserData,
    selfId: string,
    selfAvatarPath: string,
    callerName: string
  ) => Promise<void>
  enableAudio: ({ video }: { video: boolean }) => Promise<void>
  enableVideo: ({ callId, audio }: { callId: string; audio: boolean }) => Promise<void>
  updateCallerSignal: (signal: SignalData) => void
  disableVideo: () => void
  disableAudio: () => void
  applyStreamToHtmlVideoTag: (isSelf?: boolean) => void
  closeConnection: (silent?: boolean) => void
}

export interface IAdditionalServiceContext {
  call: ContextRefType<ICallService | null>
}
