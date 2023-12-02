import { useCallback } from 'react'
import _debounce from 'lodash/debounce'

export const useDebounce = (fn: any, timeout: number) => {
  return useCallback(_debounce(fn, timeout), [])
}
