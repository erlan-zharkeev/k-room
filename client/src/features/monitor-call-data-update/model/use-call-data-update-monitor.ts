import { useEffect } from 'react'

import { useCallDataChange } from 'src/features/change-call-data'
import { useCallDataLoad } from 'src/features/load-call-data'

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
