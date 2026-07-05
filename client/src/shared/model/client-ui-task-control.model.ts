import { CLIENT_UI_TASK_CONTEXT_STRING_MAX_LENGTH, CLIENT_UI_TASK_RECENT_LIMIT } from './client-ui-task.constants'
import type {
  ClientUiTaskContext,
  ClientUiTaskDiagnostics,
  ClientUiTaskRecord,
  ClientUiTaskRunner,
  ClientUiTaskSnapshot
} from './client-ui-task.types'

let clientUiTaskId = 0

const activeClientUiTasks = new Map<number, ClientUiTaskRecord>()
const recentClientUiTasks: ClientUiTaskRecord[] = []

const truncateClientUiTaskContextString = (value: string) => value.slice(0, CLIENT_UI_TASK_CONTEXT_STRING_MAX_LENGTH)

const normalizeClientUiTaskContext = (context?: ClientUiTaskContext) => {
  if (!context) return undefined

  const normalizedContext: ClientUiTaskContext = {}

  Object.entries(context).forEach(([key, value]) => {
    if (value === undefined) return

    normalizedContext[key] = typeof value === 'string' ? truncateClientUiTaskContextString(value) : value
  })

  return Object.keys(normalizedContext).length ? normalizedContext : undefined
}

const createClientUiTaskSnapshot = (
  task: ClientUiTaskRecord,
  freezeStartTimeMs: number,
  freezeEndTimeMs: number
): ClientUiTaskSnapshot => {
  const finishedAtMs = task.finishedAtMs ?? performance.now()

  return {
    activeAtFreezeEnd: !task.finishedAtMs || task.finishedAtMs >= freezeEndTimeMs,
    activeAtFreezeStart: task.startedAtMs <= freezeStartTimeMs && finishedAtMs >= freezeStartTimeMs,
    context: task.context,
    durationMs: Math.round(finishedAtMs - task.startedAtMs),
    finishedAtMs: task.finishedAtMs ? Math.round(task.finishedAtMs) : null,
    id: task.id,
    name: task.name,
    startedAtMs: Math.round(task.startedAtMs)
  }
}

const isTaskRelevantToFreeze = (
  task: ClientUiTaskRecord,
  freezeStartTimeMs: number,
  freezeEndTimeMs: number,
  recentWindowMs: number
) => {
  const finishedAtMs = task.finishedAtMs ?? freezeEndTimeMs
  const minStartedAtMs = freezeStartTimeMs - recentWindowMs

  return task.startedAtMs <= freezeEndTimeMs && finishedAtMs >= minStartedAtMs
}

const resolveProbableClientUiTask = (tasks: ClientUiTaskSnapshot[]) =>
  tasks.find(({ activeAtFreezeStart }) => activeAtFreezeStart) ??
  tasks.find(({ activeAtFreezeEnd }) => activeAtFreezeEnd) ??
  tasks[tasks.length - 1] ??
  null

export const readClientUiTaskDiagnostics = (
  freezeStartTimeMs: number,
  freezeEndTimeMs: number,
  recentWindowMs: number
): ClientUiTaskDiagnostics => {
  const activeTasks = [...activeClientUiTasks.values()]
    .filter((task) => isTaskRelevantToFreeze(task, freezeStartTimeMs, freezeEndTimeMs, recentWindowMs))
    .map((task) => createClientUiTaskSnapshot(task, freezeStartTimeMs, freezeEndTimeMs))

  const recentTasks = recentClientUiTasks
    .filter((task) => isTaskRelevantToFreeze(task, freezeStartTimeMs, freezeEndTimeMs, recentWindowMs))
    .slice(-CLIENT_UI_TASK_RECENT_LIMIT)
    .map((task) => createClientUiTaskSnapshot(task, freezeStartTimeMs, freezeEndTimeMs))

  return {
    activeTasks,
    probableTask: resolveProbableClientUiTask([...recentTasks, ...activeTasks]),
    recentTasks
  }
}

export const runClientUiTask = async <T>(
  name: string,
  runner: ClientUiTaskRunner<T>,
  context?: ClientUiTaskContext
): Promise<T> => {
  const task: ClientUiTaskRecord = {
    context: normalizeClientUiTaskContext(context),
    id: ++clientUiTaskId,
    name: truncateClientUiTaskContextString(name),
    startedAtMs: performance.now()
  }

  activeClientUiTasks.set(task.id, task)

  try {
    return await runner()
  } finally {
    activeClientUiTasks.delete(task.id)
    task.finishedAtMs = performance.now()
    recentClientUiTasks.push(task)

    if (recentClientUiTasks.length > CLIENT_UI_TASK_RECENT_LIMIT) {
      recentClientUiTasks.shift()
    }
  }
}
