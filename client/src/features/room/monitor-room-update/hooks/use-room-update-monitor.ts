import { useEffect } from 'react'

import { useRoomsLoading } from '../../load-rooms'

export const useRoomUpdateMonitor = () => {
  const { monitorRoomLoading } = useRoomsLoading()

  useEffect(() => {
    monitorRoomLoading()
  }, [])
}
