import { useEffect } from 'react'
import { useCallDataLoad } from '../../load-call-data '
import { useCallDataChange } from '../../change-call-data'

export const useCallDataUpdateMonitor = () => {
  const { monitorCallDataLoading } = useCallDataLoad()
  const { monitorCallDataChanging } = useCallDataChange()

  const monitorCallDataUpdate = () => {
    useEffect(() => {
      monitorCallDataLoading()
      monitorCallDataChanging()
    }, [])
  }
  return { monitorCallDataUpdate }
}
