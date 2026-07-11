import type { UnknownObject } from 'global-shared'

export type ClientFreezeKind = 'input-delay' | 'long-task'

export type ClientFreezeContext = UnknownObject

export type ClientFreezeDiagnosticEvent = ClientFreezeContext & {
  atMs: number
  fullPath: string
  kind: string
}

export type ClientFreezeRouteTransition = {
  finishedAtMs?: number
  fromFullPath: string
  fromName: string | null
  startedAtMs: number
  toFullPath: string
  toName: string | null
}
