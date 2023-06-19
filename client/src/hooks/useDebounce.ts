import { useCallback } from 'react'
import _debounce from 'lodash/debounce'

const useDebounce = (fn: any, timeout: number) => {
  return useCallback(_debounce(fn, timeout), [])
}

export default useDebounce
