export type ClientFreezeKind = 'input-delay' | 'long-task'

export type ClientFreezeContext = Record<string, unknown>

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
