import { beforeEach, describe, expect, it, vi } from 'vitest'

const storageMock = vi.hoisted(() => ({
  loadStorageEstimate: vi.fn()
}))

vi.mock('../storage/storage.model', () => storageMock)

const { isDexieQuotaError, registerDexieCacheTrimmer, runDexieCacheTrimGuard } = await import('./cache-trim')

const createSafariStorageWriteError = () => ({
  message: 'Unable to store record in object store\n UnknownError: Unable to store record in object store',
  name: 'UnknownError'
})

const createSafariStorageDeleteError = () => ({
  message: 'Failed to delete record from object store',
  name: 'UnknownError'
})

const createSafariStorageBulkError = () => ({
  failures: [createSafariStorageDeleteError()],
  message:
    'known-users.bulkPut(): 1 of 1 operations failed. Errors: UnknownError: Failed to delete record from object store',
  name: 'BulkError'
})

const createSafariStorageModifyError = () => ({
  message: 'Error modifying one or more objects. Errors: UnknownError: Failed to delete record from object store',
  name: 'ModifyError'
})

const createSafariStorageWrappedError = () =>
  new Error('Error modifying one or more objects. Errors: UnknownError: Failed to delete record from object store')

const createSafariTransientTransactionError = () => ({
  failures: [
    {
      message: 'Attempt to delete range from database without an in-progress transaction',
      name: 'UnknownError'
    }
  ],
  message:
    'known-users.bulkPut(): 1 of 1 operations failed. Errors: UnknownError: Attempt to delete range from database without an in-progress transaction',
  name: 'BulkError'
})

describe('cache-trim', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    storageMock.loadStorageEstimate.mockResolvedValue(undefined)
  })

  it('treats Safari IndexedDB object store write failures as recoverable storage errors', () => {
    expect(isDexieQuotaError(createSafariStorageWriteError())).toBe(true)
  })

  it('treats Safari IndexedDB object store delete failures as recoverable storage errors', () => {
    expect(isDexieQuotaError(createSafariStorageBulkError())).toBe(true)
  })

  it('treats Dexie modify wrappers around Safari IndexedDB delete failures as recoverable storage errors', () => {
    expect(isDexieQuotaError(createSafariStorageModifyError())).toBe(true)
    expect(isDexieQuotaError(createSafariStorageWrappedError())).toBe(true)
  })

  it('retries operation after trimming cache for Safari IndexedDB write failures', async () => {
    const trim = vi.fn(async () => ({ trimmed: true }))
    const operation = vi.fn().mockRejectedValueOnce(createSafariStorageWriteError()).mockResolvedValueOnce('saved')

    registerDexieCacheTrimmer({
      id: 'media',
      priority: 10,
      trim
    })

    await expect(runDexieCacheTrimGuard(operation)).resolves.toBe('saved')

    expect(trim).toHaveBeenCalledTimes(1)
    expect(operation).toHaveBeenCalledTimes(2)
  })

  it('retries a Safari transient transaction failure in a fresh transaction', async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(createSafariTransientTransactionError())
      .mockResolvedValueOnce('saved')

    await expect(runDexieCacheTrimGuard(operation)).resolves.toBe('saved')

    expect(operation).toHaveBeenCalledTimes(2)
  })

  it('keeps throwing when a Safari transient transaction retry fails', async () => {
    const retryError = createSafariTransientTransactionError()
    const operation = vi
      .fn()
      .mockRejectedValueOnce(createSafariTransientTransactionError())
      .mockRejectedValueOnce(retryError)

    await expect(runDexieCacheTrimGuard(operation)).rejects.toBe(retryError)

    expect(operation).toHaveBeenCalledTimes(2)
  })
})
