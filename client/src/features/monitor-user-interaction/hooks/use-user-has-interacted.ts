import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { setHasInteraction, useSystem } from 'src/entities/system'

export const useUserInteractionMonitor = () => {
  const { hasInteracted } = useSystem()
  const dispatch = useDispatch()

  const onUserInteraction = () => {
    window.removeEventListener('click', onUserInteraction)
    window.removeEventListener('pointerdown', onUserInteraction)
    window.removeEventListener('keydown', onUserInteraction)
    dispatch(setHasInteraction(true))
  }

  useEffect(() => {
    if (hasInteracted) return

    window.addEventListener('click', onUserInteraction)
    window.addEventListener('pointerdown', onUserInteraction)
    window.addEventListener('keydown', onUserInteraction)

    return () => {
      window.removeEventListener('click', onUserInteraction)
      window.removeEventListener('pointerdown', onUserInteraction)
      window.removeEventListener('keydown', onUserInteraction)
    }
  }, [])
}
