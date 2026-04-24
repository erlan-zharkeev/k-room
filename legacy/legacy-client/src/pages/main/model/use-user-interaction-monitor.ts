import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { setHasInteraction, useSystem } from 'src/shared/system'

export const useUserInteractionMonitor = () => {
  const { hasInteracted } = useSystem()
  const dispatch = useDispatch()

  useEffect(() => {
    if (hasInteracted) return

    const onUserInteraction = () => {
      window.removeEventListener('click', onUserInteraction)
      window.removeEventListener('pointerdown', onUserInteraction)
      window.removeEventListener('keydown', onUserInteraction)
      dispatch(setHasInteraction(true))
    }

    window.addEventListener('click', onUserInteraction)
    window.addEventListener('pointerdown', onUserInteraction)
    window.addEventListener('keydown', onUserInteraction)

    return () => {
      window.removeEventListener('click', onUserInteraction)
      window.removeEventListener('pointerdown', onUserInteraction)
      window.removeEventListener('keydown', onUserInteraction)
    }
  }, [dispatch, hasInteracted])
}
