import { describe, expect, it } from 'vitest'

import { readClientUiTaskDiagnostics, runClientUiTask } from './client-ui-task-control.model'

describe('client-ui-task', () => {
  it('reports the task active during the freeze window', async () => {
    let diagnostics: ReturnType<typeof readClientUiTaskDiagnostics> | undefined

    await runClientUiTask('test:active-task', async () => {
      const freezeStartTimeMs = performance.now()

      diagnostics = readClientUiTaskDiagnostics(freezeStartTimeMs, freezeStartTimeMs + 1, 1_000)
    })

    expect(diagnostics?.activeTasks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          activeAtFreezeStart: true,
          name: 'test:active-task'
        })
      ])
    )
    expect(diagnostics?.probableTask).toEqual(
      expect.objectContaining({
        name: 'test:active-task'
      })
    )
  })

  it('keeps a recently finished task for delayed observer callbacks', async () => {
    const freezeStartTimeMs = performance.now()

    await runClientUiTask('test:recent-task', async () => {})

    const diagnostics = readClientUiTaskDiagnostics(freezeStartTimeMs, performance.now(), 1_000)

    expect(diagnostics.recentTasks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'test:recent-task'
        })
      ])
    )
  })
})
