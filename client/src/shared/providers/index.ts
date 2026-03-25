import { createContext } from 'react'

import type { IFrontendUserData } from 'common'
import type { SignalData } from 'simple-peer'

import { ContextRefType } from '../config'

interface IRefsContext {
  interlocutorVideoDom: ContextRefType<HTMLVideoElement | null>
  selfVideoDom: ContextRefType<HTMLVideoElement | null>
}

interface ICallService {
  calling: (callerId: string, callerSignalData: SignalData) => void
  leaveCall: (callId: string) => void
  answerCall: (callId: string) => Promise<void>
  initCall: (interlocutorData: IFrontendUserData, selfId: string, selfAvatarPath: string, callerName: string) => Promise<void>
  enableAudio: ({ video }: { video: boolean }) => Promise<void>
  enableVideo: ({ callId, audio }: { callId: string; audio: boolean }) => Promise<void>
  updateCallerSignal: (signal: SignalData) => void
  disableVideo: () => void
  disableAudio: () => void
  applyStreamToHtmlVideoTag: (isSelf?: boolean) => void
  closeConnection: (silent?: boolean) => void
}

interface IAdditionalServiceContext {
  call: ContextRefType<ICallService | null>
}

export const RefsContext = createContext<IRefsContext>({} as IRefsContext)
export const AdditionalServiceContext = createContext<IAdditionalServiceContext>({} as IAdditionalServiceContext)
