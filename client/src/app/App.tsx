import 'src/shared/config/styles'
import { useEffect } from 'react'
import { AppRouter } from './router'
import { useAudioContextMonitor } from 'src/features/monitor-audio-context'
import { useNetworkMonitor } from 'src/features/monitor-network/hooks'
import { useViewportMonitor } from 'src/features/monitor-viewport'
import { useCheckAuth } from 'src/features/auth'
import { useThemeUpdate } from 'src/features/update-theme'

export const App = () => {
  const { monitorToShowAudioContextNotification } = useAudioContextMonitor()
  const { monitorNetwork } = useNetworkMonitor()
  const { monitorViewPortChanges } = useViewportMonitor()
  const { checkAuth } = useCheckAuth()
  const { setTheme } = useThemeUpdate()

  useEffect(() => {
    setTheme()
    monitorViewPortChanges()
    monitorNetwork()
    checkAuth()
    monitorToShowAudioContextNotification()
  }, [])

  return (
    <>
      <AppRouter />
    </>
  )
}
