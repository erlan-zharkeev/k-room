import { useCallback } from 'react'
import _debounce from 'lodash/debounce'

export const useDebounce = (fn: (payload: any) => void, timeout: number) => {
  return useCallback(_debounce(fn, timeout), [])
}
