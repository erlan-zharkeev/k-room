import { useEffect } from 'react'

import { useCallDataChange, useCallDataLoad } from '../..'

export const useCallDataUpdateMonitor = () => {
  const { monitorCallDataLoading } = useCallDataLoad()
  const { monitorCallDataChanging } = useCallDataChange()

  useEffect(() => {
    const cleanupLoad = monitorCallDataLoading()
    const cleanupChange = monitorCallDataChanging()

    return () => {
      cleanupLoad()
      cleanupChange()
    }
  }, [monitorCallDataChanging, monitorCallDataLoading])
}
