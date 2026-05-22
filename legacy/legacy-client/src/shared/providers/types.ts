import { SignalData } from 'simple-peer'

import { IFrontendUserData } from 'common'

import { ContextRef } from 'src/shared/config'

export interface RefsContext {
  interlocutorVideoDom: ContextRef<HTMLVideoElement | null>
  selfVideoDom: ContextRef<HTMLVideoElement | null>
}

export interface CallService {
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

export interface AdditionalServiceContext {
  call: ContextRef<CallService | null>
}
