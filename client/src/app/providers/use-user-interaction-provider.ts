import { onBeforeUnmount, onMounted, watch } from 'vue'

import { useSystem } from 'src/entities/system'

import { INTERACTION_EVENTS } from '../config/constants'

export const useUserInteractionProvider = () => {
  const { hasInteracted, setHasInteracted } = useSystem()

  function removeListeners() {
    INTERACTION_EVENTS.forEach((eventName) => {
      window.removeEventListener(eventName, handleInteraction)
    })
  }

  function handleInteraction() {
    removeListeners()
    setHasInteracted(true)
  }

  watch(hasInteracted, (interacted) => {
    if (interacted) {
      removeListeners()
    }
  })

  onMounted(() => {
    if (hasInteracted.value) return

    INTERACTION_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleInteraction)
    })
  })

  onBeforeUnmount(removeListeners)
}
