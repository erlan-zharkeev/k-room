export type ClientUiTaskContextValue = string | number | boolean | null | undefined

export type ClientUiTaskContext = Record<string, ClientUiTaskContextValue>

export interface ClientUiTaskRecord {
  context?: ClientUiTaskContext
  finishedAtMs?: number
  id: number
  name: string
  startedAtMs: number
}

export interface ClientUiTaskSnapshot {
  activeAtFreezeEnd: boolean
  activeAtFreezeStart: boolean
  context?: ClientUiTaskContext
  durationMs: number
  finishedAtMs: number | null
  id: number
  name: string
  startedAtMs: number
}

export interface ClientUiTaskDiagnostics {
  activeTasks: ClientUiTaskSnapshot[]
  probableTask: ClientUiTaskSnapshot | null
  recentTasks: ClientUiTaskSnapshot[]
}

export type ClientUiTaskRunner<T> = () => T | Promise<T>
