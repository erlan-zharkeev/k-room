import { dexieCallStore } from 'src/shared/lib'

export const useCall = () => {
  const { bulkPut, put, reset } = dexieCallStore
  const calls = dexieCallStore.use()

  return {
    calls,
    bulkPut,
    put,
    reset
  }
}
